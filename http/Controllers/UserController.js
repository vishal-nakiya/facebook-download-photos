const { validationResult } = require("express-validator");
const User = require("../../Models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const WalletBalance = require("../../Models/WalletBalance");
const Sequelize = require('sequelize');

const userMasterController = () => {
    return {
        UserSignup: async (req, res) => {
            try {
                // Checking validation errors, using express-validator
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    const error = errors.array().map((x) => {
                      return {
                        field: x.param,
                        message: x.msg
                      };
                    })
                    return res.status(409).json({ error, success: false });
                }
                //creating data object for insertion
                const { name, password, mobile_number, email, auth_token, refresh_token, referral_code, user_referral_code } = req.body

                const hashedPassword = await bcrypt.hash(password, 10);

                const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
                const numericChars = '0123456789';

                const getRandomChar = (charSet) => charSet[Math.floor(Math.random() * charSet.length)];

                let referralCode;

                do {
                    referralCode = [
                        getRandomChar(uppercaseChars),
                        getRandomChar(lowercaseChars),
                        getRandomChar(numericChars),
                        getRandomChar(uppercaseChars + lowercaseChars + numericChars),
                        getRandomChar(uppercaseChars + lowercaseChars + numericChars),
                        getRandomChar(uppercaseChars + lowercaseChars + numericChars),
                    ].join('');
                } while (await User.findOne({ where: { referral_code: referralCode } }));
                
                let findreferalluser
                if (user_referral_code) {
                     findreferalluser = await User.findOne({
                        where: {
                            referral_code: user_referral_code,
                            deleted_at: null,
                            status: 1
                        },
                        attributes: ["id"]
                    })
                    if (user_referral_code && !findreferalluser) {
                        return res.status(400).json({
                            success: false,
                            message: 'Please enter valid referral code!'
                        })
                    }
                }
                const data = {
                    name,
                    password: hashedPassword,
                    mobile_number,
                    email,
                    auth_token,
                    refresh_token,
                    referral_code,
                    status: 1,
                    is_admin: 0,
                    referral_code: referralCode,
                    referral_user_id: findreferalluser ? findreferalluser.dataValues.id : null
                }

                const user = await User.create(data);
                return res.status(200).json({ success: true, message: "User Created Succesfully"});
                
            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal Server error", });
            }
        },
        Userlogin: async (req, res) => {
            try {
                // Checking validation errors, using express-validator
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    const error = errors.array().map((x) => {
                        return {
                            field: x.param,
                            message: x.msg
                        };
                    })
                    return res.status(409).json({ error, success: false });
                }
                const { mobile_number, password } = req.body;
                let user = await User.findOne({
                    attributes: ['id', 'name', 'email', 'password','is_admin'],
                    where: { mobile_number, deleted_at: null },
                });

                if (!user) return res.status(400).json({ success: false, message: "You have not registered with the mobile number.Please register first" });

                const isPasswordMatch = await bcrypt.compare(password, user.dataValues.password);
                if (!isPasswordMatch) return res.status(400).json({ success: false, message: "Please enter correct password!" });

                const data = {
                    user: {
                        id: user.dataValues.id,
                    },
                };

                const authToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '2h' });
                const refreshToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '8h' });
                const test = await User.update({ auth_token: authToken, refresh_token: refreshToken }, { where: { mobile_number } });
                res.cookie("authorization", `Bearer ${authToken}`).status(200).json({
                    success: true,
                    message: 'User data retrive succesfully',
                    data: {
                        authToken,
                        refreshToken,
                        id: user.dataValues.id,
                        name: user.dataValues.name,
                        is_admin: user.dataValues.is_admin,
                    }
                });

            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal Server error", });
            }
        },
        update: async (req, res) => {
            try {
                // Checking validation errors, using express-validator
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    const error = errors.array().map((x) => {
                        return {
                            field: x.param,
                            message: x.msg
                        };
                    })
                    return res.status(409).json({ error, success: false });
                }
                const usercheck = await User.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (!usercheck) {
                    return res.status(400).json({
                        success: false,
                        message: 'User not found!'
                    })
                }
                //creating data object for insertion
                const { status } = req.body

                const data = {
                    status
                }

                const user = await User.update(data, {
                    where: {
                        id: req.params.id
                    }
                });
                return res.status(200).json({ success: true, message: "User updated Succesfully" });

            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal Server error", });
            }
        },
        readAll: async (req, res) => {
            try {
                const mydata = await User.findAll({
                    order: [['id', 'DESC']],
                    where: {
                        deleted_at: null
                    },
                    attributes: ["id", "name", "mobile_number", "email", "referral_code", "referral_points", "status"],
                    include: [
                        {
                            model: WalletBalance,
                            as: "balanceDetails",
                            attributes: ["id", "running_balance"],
                            required: false,
                        }
                    ],
                    order: [
                        [Sequelize.literal('`balanceDetails`.`id` DESC')]
                    ],
                })
                if (!mydata.length) return res.status(400).json({
                    success: false,
                    message: "No user data found!",
                });

                const modifiedData = mydata.map(userdata => {
                    if (userdata.balanceDetails && userdata.balanceDetails.length > 0) {
                        const maxBalance = parseFloat(userdata.balanceDetails[0].running_balance);
                        return {
                            ...userdata.toJSON(),
                            running_balance: maxBalance,
                            balanceDetails: undefined,
                        };
                    } else {
                        return {
                            ...userdata.toJSON(),
                            running_balance: null,
                            balanceDetails: undefined,
                        };
                    }
                });


                //FINALLY, Sending data in response
                res.status(200).json({
                    success: true,
                    message: "User data fetch succesfully",
                    data: modifiedData,
                })
            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal Server error", });
            }
        },
        myProfileRead: async (req, res) => {
            try {
                const mydata = await User.findAll({
                    where: {
                        deleted_at: null,
                        id: req.user.id
                    },
                    attributes: ["id", "name", "mobile_number", "email", "referral_code"]
                })
                if (!mydata) return res.status(400).json({
                    success: false,
                    message: "No data found",
                });;
                //FINALLY, Sending data in response
                res.status(200).json({
                    success: true,
                    message: "My profile data fetched successfully",
                    data: mydata,
                })
            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal server error", });
            }
        },
        myProfilePassword: async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                  const error = errors.array().map((x) => {
                    return {
                      field: x.param,
                      message: x.msg,
                    };
                  });
                  return res.status(400).json({ error, success: false });
                }
            
                const { old_password, new_password } = req.body;
            
                const user = await User.findOne({ where : { id: req.user.id }});
            
                const isPasswordValid = await bcrypt.compare(old_password, user.password);

                if (!isPasswordValid) {
                    return res.status(400).json({ success: false, message: 'Old password is incorrect' });
                  }

                const isNewPasswordSameAsOld = await bcrypt.compare(new_password, user.password);

                if (isNewPasswordSameAsOld) {
                    return res.status(400).json({ success: false, message: 'New password must be different from the old password' });
                  }
            
                const hashedNewPassword = await bcrypt.hash(new_password, 10);
        
                await user.update({ password: hashedNewPassword });
            
                return res.status(200).json({ success: true, message: 'Password changed successfully' });
              } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Internal server error' });
              }
        },
        readreferralUser: async (req, res) => {
            try {
                const mydata = await User.findAll({
                    where: {
                        deleted_at: null,
                        referral_user_id: req.user.id
                    },
                    attributes: ["id", "name", "mobile_number", "email", "referral_code", "referral_points", "status"],
                })
                if (!mydata.length) return res.status(400).json({
                    success: false,
                    message: "No user data found!",
                });

                //FINALLY, Sending data in response
                res.status(200).json({
                    success: true,
                    message: "User data fetch succesfully",
                    data: mydata,
                })
            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal Server error", });
            }
        },
    }
};

module.exports = userMasterController