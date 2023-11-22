const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../../Models/Users");
// const logError = require("../../logger/log");
const authMiddleware = async (req, res, next) => {
    const authHeader = req.cookies['authorization'] || req.headers['authorization'];
    if (authHeader && authHeader.startsWith("Bearer")) {
        try {
            let token = authHeader.split(" ")[1];
            const data = jwt.verify(token, process.env.JWT_SECRET);
            const userData = await User.findByPk(data.user.id);
            if (!userData || userData.auth_token != token) {
                return res.status(440).json({
                    message: "Session expired. Please login again.",
                    success: false,
                });
            }
            req.user = userData.dataValues;
            next();
        } catch (error) {
            res.status(400).json({
                message: "Session expired. Please login again.",
                success: false,
            });
               
                
        }
    } else {
        res.status(400).json({
            message: "Session expired. Please login again.",
            success: false,
        });
    }
};

module.exports = authMiddleware;