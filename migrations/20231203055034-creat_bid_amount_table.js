'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bids",
      {
        id: { type: Sequelize.INTEGER(11).UNSIGNED, autoIncrement: true, allowNull: false, primaryKey: true, },
        user_id: { type: Sequelize.INTEGER(11), allowNull: true },
        zodiac_id: { type: Sequelize.INTEGER(11), allowNull: true },
        time_slot_id: { type: Sequelize.INTEGER(11), allowNull: true },
        bid_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
        date: { type: Sequelize.STRING, allowNull: true },
        deleted_at: { type: Sequelize.DATE, allowNull: true },

        created_at: {
          type: "TIMESTAMP",
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          allowNull: false,
        },
        updated_at: {
          type: "TIMESTAMP",
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
          ),
          allowNull: false,
        },

      }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bids');
    /**
     * Add reverting commands here.
     *
     * Example:
     */
  }
};
