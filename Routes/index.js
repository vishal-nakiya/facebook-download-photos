const express = require("express");
const Router = express.Router();
const requireDirectory = require('require-directory');

const routes = requireDirectory(module, '.');
for (let route in routes) {
    let newRoute;
    if (route.includes('Routes')) {
        newRoute = route.replace('Routes', '');
    } else {
        newRoute = route;
    }
  Router.use(`/api/${newRoute}`, require(`./${route}`));
}

module.exports = Router;