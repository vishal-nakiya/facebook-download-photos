const express = require('express');
const Router = express.Router();
const zodiacController = require('../http/Controllers/zodiacController');
const fileUpload = require('express-fileupload');

Router.post('/create', fileUpload(), zodiacController().addZodiac);

Router.get('/read',  zodiacController().readZodiac);

Router.put('/update/:id', fileUpload(), zodiacController().updateZodiac);

Router.delete('/delete/:id',  zodiacController().deleteZodiac);

module.exports = Router;
