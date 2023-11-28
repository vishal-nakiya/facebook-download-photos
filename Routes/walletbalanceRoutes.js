const express = require('express');
const Router = express.Router();
const WalletBalanceController = require('../http/Controllers/WalletBalanceController');
const fileUpload = require('express-fileupload');
const authMiddleware = require('../http/middlewares/authMiddleware');

Router.post('/amount/request', authMiddleware, WalletBalanceController().AmountRequest);

module.exports = Router;
