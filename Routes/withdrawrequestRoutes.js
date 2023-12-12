const express = require('express');
const Router = express.Router();
const WithdrawRequestController = require('../http/Controllers/WithdrawRequestController');
const authMiddleware = require('../http/middlewares/authMiddleware');
const { check } = require('express-validator');

Router.post('/request/create', authMiddleware, WithdrawRequestController().WithdrawRequest);

Router.get('/request/list', authMiddleware,
    WithdrawRequestController().Readrequests);


Router.post('/request/accept', 
    WithdrawRequestController().RequestsAccept);

Router.post('/request/reject', authMiddleware,
    WithdrawRequestController().RequestsReject);

Router.get('/userRequestLists', authMiddleware,
    WithdrawRequestController().UserRequestLists);

module.exports = Router;
