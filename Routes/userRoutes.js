const express = require('express');
const Router = express.Router();
const userController = require('../http/Controllers/UserController');
const { body } = require('express-validator');
const User = require('../Models/Users');
const authMiddleware = require('../http/middlewares/authMiddleware');
const { Op } = require('sequelize');

Router.post('/signup', [
    body("name").trim().isLength({ min: 1 }).withMessage('Please enter full name'),
    body('user_referral_code')
        .custom((value, { req }) => {
            // Check if the field has a value before applying length validation
            if (value) {
                // Apply length validation if there is a value
                return req.body.user_referral_code.trim().length === 6;

            }
          
            // Return true if the field is empty (validation is not required in this case)
            return true;
        })
        .withMessage('Please enter referral code with 6 digits'),
    body("mobile_number").custom((value) => {
        if (!value) {
            return Promise.reject("Enter phone number")
        }
        //const regex = /^[0-9]{10}$/;
        const regex = /^[0-9]{3,}$/;
        if (!String(value).match(regex)) {
            return Promise.reject("Enter a valid phone number");
        }
        return User.findOne({ where: { mobile_number: value }, attributes: ["id", "deleted_at", "mobile_number"] }).then((data) => {
            if (!data) {
                return true;
            }
            if (data.dataValues.deleted_at === null) {
                return Promise.reject("This mobile number is already have an account.Please enter another number");
            }
        });
    }),
    body("email").custom((value) => {
        if (!value) {
            return Promise.reject("Enter email");
        }
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!value.match(regex)) {
            return Promise.reject("Enter a valid email");
        }
        return User.findOne({ where: { email: value }, attributes: ["id", "deleted_at", "email"] }).then((data) => {
            if (!data) {
                return true;
            }
            if (data.dataValues.deleted_at === null) {
                return Promise.reject("This email is already have an account.Please enter another email");
            }
        })
    }),
    body("password").trim().isLength({ min: 6 }).withMessage('Please enter minimum 6 character password'),
], userController().UserSignup);

Router.post("/login", [
    //body("mobile_number").matches(/^[0-9]{10}$/).withMessage("Enter a valid mobile format"),
    body("mobile_number").trim().isLength({ min: 1 }).matches(/^[0-9]{3,}$/).withMessage("Enter a valid mobile format"),
],
    userController().Userlogin);

Router.put('/update/:id', authMiddleware, [
    // body("name").trim().isLength({ min: 1 }).withMessage('Please enter full name'),
    // body("mobile_number").trim().isLength({ min: 1 }).withMessage('Please enter mobile number'),
    // body("email").trim().isLength({ min: 1 }).withMessage('Please enter email'),
    // body("mobile_number").custom((value, { req, loc, path }) => {
    //     if (!value) {
    //         return Promise.reject("Enter phone number")
    //     }
    //     //const regex = /^[0-9]{10}$/;
    //     const regex = /^[0-9]{3,}$/;
    //     if (!String(value).match(regex)) {
    //         return Promise.reject("Enter a valid phone number");
    //     }
    //     // return User.findOne({
    //     //     where: {
    //     //         mobile_number: value,
    //     //         id: {
    //     //             [Op.ne]: parseInt(req.params.id)
    //     //         }
    //     //     }, attributes: ["id", "deleted_at", "mobile_number"]
    //     // }).then((data) => {
    //     //     if (!data) {
    //     //         return true;
    //     //     }
    //     //     if (data.dataValues.deleted_at === null) {
    //     //         return Promise.reject("This mobile number is already have an account.Please enter another number");
    //     //     }
    //     // });
    // }),
    // body("email").custom((value, { req, loc, path }) => {
    //     if (!value) {
    //         return Promise.reject("Enter email");
    //     }
    //     const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //     if (!value.match(regex)) {
    //         return Promise.reject("Enter a valid email");
    //     }
    //     // return User.findOne({
    //     //     where: {
    //     //         email: value,
    //     //         id: {
    //     //             [Op.ne]: parseInt(req.params.id)
    //     //         }
    //     //     }, attributes: ["id", "deleted_at", "email"]
    //     // }).then((data) => {
    //     //     if (!data) {
    //     //         return true;
    //     //     }
    //     //     if (data.dataValues.deleted_at === null) {
    //     //         return Promise.reject("This email is already have an account.Please enter another email");
    //     //     }
    //     // })
    // }),
], userController().update);
Router.get("/readAll", authMiddleware, userController().readAll)
Router.get("/readMyProfile", authMiddleware, userController().myProfileRead)
Router.post("/newPassword", [
    body("new_password").trim().isLength({ min: 6 }).withMessage('Please enter minimum 6 character password'),
], authMiddleware, userController().myProfilePassword)

Router.get("/referralUsers/listing", authMiddleware, userController().readreferralUser)


module.exports = Router;
