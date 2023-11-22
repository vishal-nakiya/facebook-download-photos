const Sequelize = require("sequelize");
const sequelize = require("../config/dbconfig");

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


module.exports = Zodiac;
