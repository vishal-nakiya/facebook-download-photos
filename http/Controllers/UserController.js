const User = require("../../Models/Users");

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
                const { id, name, password, mobile_number, email, is_admin, auth_token, refresh_token, referral_code, referral_points}=req.body

                const data = {
                    id,
                    name,
                    password,
                    mobile_number,
                    email, is_admin,
                    auth_token,
                    refresh_token,
                    referral_code,
                    referral_points,
                }

                const User = await User.create(data);
                return res.status(500).json({ success: true, message: "User Created Succesfully"});
                
            } catch (error) {
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
                //creating data object for insertion
                const { id, name, password, mobile_number, email, is_admin, auth_token, refresh_token, referral_code, referral_points}=req.body

                const data = {
                    id,
                    name,
                    password,
                    mobile_number,
                    email, is_admin,
                    auth_token,
                    refresh_token,
                    referral_code,
                    referral_points,
                }

                const User = await User.create(data);
                return res.status(500).json({ success: true, message: "User Created Succesfully"});
                
            } catch (error) {
                res.status(500).json({ success: false, message: "Internal Server error", });
            }
        },
    }
};

module.exports = userMasterController