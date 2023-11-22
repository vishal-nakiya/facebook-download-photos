const express = require('express');
const Router = express.Router();
const zodiacController = require('../http/Controllers/zodiacController');
const fileUpload = require('express-fileupload');
const authMiddleware = require('../http/middlewares/authMiddleware');

Router.post('/create', authMiddleware, fileUpload(), zodiacController().addZodiac);

Router.get('/read', authMiddleware,  zodiacController().readZodiac);

Router.put('/update/:id', authMiddleware, fileUpload(), zodiacController().updateZodiac);

Router.delete('/delete/:id', authMiddleware,  zodiacController().deleteZodiac);

module.exports = Router;
