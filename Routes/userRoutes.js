const express = require('express');
const Router = express.Router();
const userController = require('../http/Controllers/UserController');

Router.get('/new', userController().UserSignup);

module.exports = Router;
