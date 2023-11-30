const Sequelize = require("sequelize");
const sequelize = require("../config/dbconfig");

const TimeSlot = sequelize.define("time_slots", {
    id: { type: Sequelize.INTEGER(11).UNSIGNED, autoIncrement: true, allowNull: false, primaryKey: true },
    start_time: { type: Sequelize.TIME, allowNull: false },
    end_time: { type: Sequelize.TIME, allowNull: false },
    amount: {type: Sequelize.DECIMAL(15,2), allowNull: true},
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


module.exports = TimeSlot;
