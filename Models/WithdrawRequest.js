const Sequelize = require("sequelize");
const sequelize = require("../config/dbconfig");

const WithdrawRequest = sequelize.define("withdraw_requests", {
    id: { type: Sequelize.INTEGER(11).UNSIGNED, autoIncrement: true, allowNull: false, primaryKey: true, },
    user_id: { type: Sequelize.INTEGER(11), allowNull: true },
    request_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
    accept_decline: { type: Sequelize.TINYINT(4), allowNull: true },
    deleted_at: { type: Sequelize.DATE, allowNull: true },

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


module.exports = WithdrawRequest;
