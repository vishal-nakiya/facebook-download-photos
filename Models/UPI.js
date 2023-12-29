const Sequelize = require("sequelize");
const sequelize = require("../config/dbconfig");

const UPI = sequelize.define("payment_credentials", {
    id: { type: Sequelize.INTEGER(11).UNSIGNED, autoIncrement: true, allowNull: false, primaryKey: true, },
    upi_id: { type: Sequelize.STRING, allowNull: true },
    merchant_name: { type: Sequelize.STRING, allowNull: true },
    deleted_at: { type: Sequelize.STRING, allowNull: true },
},
    {
        timestamps: false,
        defaultScope: {
            where: {
                deleted_at: null
            }
        }
    }
);


module.exports = UPI;
