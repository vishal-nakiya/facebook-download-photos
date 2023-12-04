const Sequelize = require("sequelize");
const sequelize = require("../config/dbconfig");

const WinnerZodiac = sequelize.define("winner_zodiacs", {
    id: { type: Sequelize.INTEGER(11).UNSIGNED, autoIncrement: true, allowNull: false, primaryKey: true, },
    zodiac_id: { type: Sequelize.INTEGER(11), allowNull: true },
    time_slot_id: { type: Sequelize.INTEGER(11), allowNull: true },
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


module.exports = WinnerZodiac;
