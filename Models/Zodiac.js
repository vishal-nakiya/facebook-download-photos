const Sequelize = require("sequelize");
const sequelize = require("../config/dbconfig");
// const Bid = require("./Bids");
const zodiacController = require("../http/Controllers/zodiacController");

const Zodiac = sequelize.define("zodiacs", {
    id: { type: Sequelize.INTEGER(11).UNSIGNED, autoIncrement: true, allowNull: false, primaryKey: true, },
    name: { type: Sequelize.STRING(50), allowNull: false },
    status: { type: Sequelize.TINYINT(4), allowNull: false },
    order: { type: Sequelize.TINYINT(4), allowNull: false },
    image: { type: Sequelize.STRING(200), allowNull: false },
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

// Zodiac.hasMany(Bid, { foreignKey: "zodiac_id", as: "Zodiacdetails" });

module.exports = Zodiac;
