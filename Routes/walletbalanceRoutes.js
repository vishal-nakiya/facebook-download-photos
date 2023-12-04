const express = require('express');
const Router = express.Router();
const WalletBalanceController = require('../http/Controllers/WalletBalanceController');
const fileUpload = require('express-fileupload');
const authMiddleware = require('../http/middlewares/authMiddleware');
const { check } = require('express-validator');

Router.post('/amount/request', authMiddleware, [
    check("user_id").exists().withMessage("Enter user_id"),
],
    WalletBalanceController().AmountRequest);

Router.get('/request/list', authMiddleware, WalletBalanceController().ReadAmountrequest);

Router.get('/total/bid/user', authMiddleware, WalletBalanceController().ReadperticularuserTotalbid);

module.exports = Router;
