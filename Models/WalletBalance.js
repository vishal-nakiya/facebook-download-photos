const Sequelize = require("sequelize");
const sequelize = require("../config/dbconfig");

const WalletBalance = sequelize.define("wallet_balances", {
    id: { type: Sequelize.INTEGER(11).UNSIGNED, autoIncrement: true, allowNull: false, primaryKey: true, },
    user_id: { type: Sequelize.INTEGER(11), allowNull: true },
    debit_credit: { type: Sequelize.TINYINT(4), allowNull: true },
    amount: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
    running_balance: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
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


module.exports = WalletBalance;
