const { validationResult } = require("express-validator");
const User = require("../../Models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

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
                const { name, password, mobile_number, email, auth_token, refresh_token, referral_code } = req.body

                const hashedPassword = await bcrypt.hash(password, 10);

                const data = {
                    name,
                    password: hashedPassword,
                    mobile_number,
                    email,
                    auth_token,
                    refresh_token,
                    referral_code,
                }

                const user = await User.create(data);
                return res.status(500).json({ success: true, message: "User Created Succesfully"});
                
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
                    attributes: ['id', 'name', 'email', 'password',],
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
                const { name, password, mobile_number, email, auth_token, refresh_token, referral_code } = req.body

                const data = {
                    name,
                    mobile_number,
                    email,
                }

                const user = await User.update(data, {
                    where: {
                        id: req.params.id
                    }
                });
                return res.status(500).json({ success: true, message: "User updated Succesfully" });

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
                    attributes: {
                        exclude: ["deleted_at", "auth_token", "refresh_token"],
                    },
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
        readOne: async (req, res) => {
            try {
                const mydata = await User.findOne({
                    where: {
                        deleted_at: null,
                        id: req.params.id
                    },
                    attributes: {
                        exclude: ["deleted_at", "auth_token", "refresh_token"],
                    },
                })
                if (!mydata) return res.status(400).json({
                    success: false,
                    message: "No user data found!",
                });;
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