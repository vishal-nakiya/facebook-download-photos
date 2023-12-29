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

Router.get('/user/transaction', authMiddleware, WalletBalanceController().ReadTransaction);

Router.post('/addUserBalance', authMiddleware, WalletBalanceController().addUserBalance);

Router.post('/addUPI/change', authMiddleware, WalletBalanceController().addUPIids);

Router.get('/upi/listing', authMiddleware, WalletBalanceController().UPIlisting);

module.exports = Router;
