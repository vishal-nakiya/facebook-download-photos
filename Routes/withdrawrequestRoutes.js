const express = require('express');
const Router = express.Router();
const WithdrawRequestController = require('../http/Controllers/WithdrawRequestController');
const authMiddleware = require('../http/middlewares/authMiddleware');
const { check } = require('express-validator');

Router.post('/request/create', authMiddleware, [
    check("user_id").exists().withMessage("Enter user_id"),
],
    WithdrawRequestController().WithdrawRequest);

Router.get('/request/list', authMiddleware,
    WithdrawRequestController().Readrequests);


Router.post('/request/accept', authMiddleware,
    WithdrawRequestController().RequestsAccept);

Router.post('/request/reject', authMiddleware,
    WithdrawRequestController().RequestsReject);

module.exports = Router;
