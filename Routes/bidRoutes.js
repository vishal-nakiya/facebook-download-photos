const express = require('express');
const Router = express.Router();
const BidController = require('../http/Controllers/BidController');
const authMiddleware = require('../http/middlewares/authMiddleware');

Router.post('/create', authMiddleware, BidController().AddBidAmount);

Router.get('/winner/list', authMiddleware, BidController().bidCronscript);

Router.post('/winner/manually', authMiddleware, BidController().createManuallyWinner);

Router.get('/list/userbid', authMiddleware, BidController().readperticularUserBidAmount);

Router.get('/biddingList', authMiddleware, BidController().biddingList);

module.exports = Router;
