const Sequelize = require("sequelize");
const sequelize = require("../config/dbconfig");

const Bid = sequelize.define("bids", {
    id: { type: Sequelize.INTEGER(11).UNSIGNED, autoIncrement: true, allowNull: false, primaryKey: true, },
    user_id: { type: Sequelize.INTEGER(11), allowNull: true },
    zodiac_id: { type: Sequelize.INTEGER(11), allowNull: true },
    time_slot_id: { type: Sequelize.INTEGER(11), allowNull: true },
    bid_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
    date: { type: Sequelize.STRING, allowNull: true },
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


module.exports = Bid;
