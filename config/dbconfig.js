require('dotenv').config()
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.SQL_DB, process.env.SQL_USERNAME, process.env.SQL_PASSWORD,
    {
        host: process.env.HOST,
        dialect: process.env.DB,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        pool: {
            max: 20,
            min: 0,
            acquire: 50000,
            idle: 50000
        },
        logging: process.env.NODE_ENV == 'development' ? true : true,
        timezone: '+05:30',
    }
);
module.exports = sequelize;