const Sequelize = require("sequelize");
const sequelize = require("../config/dbconfig");
const WalletBalance = require("./WalletBalance");

const User = sequelize.define("users", {
    id: { type: Sequelize.INTEGER(11).UNSIGNED, autoIncrement: true, allowNull: false, primaryKey: true, },
    name: { type: Sequelize.STRING(50), allowNull: false },
    password: { type: Sequelize.STRING(100), allowNull: false },
    mobile_number: { type: Sequelize.STRING(50), allowNull: false },
    email: { type: Sequelize.STRING(50), allowNull: false },
    is_admin: { type: Sequelize.TINYINT(4), allowNull: true },
    auth_token: { type: Sequelize.STRING(10000), allowNull: this.truncate },
    refresh_token: { type: Sequelize.STRING(10000), allowNull: this.truncate },
    referral_code: { type:Sequelize.STRING, allowNull:true },
    referral_points: { type: Sequelize.DECIMAL(10, 2), allowNull:true, defaultValue:0 },
    status: { type: Sequelize.TINYINT, allowNull: false,  defaultValue: 1 } ,
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

/* Joins */

User.hasMany(WalletBalance, {
    foreignKey: "user_id",
    as: "balanceDetails",
});


module.exports = User;
