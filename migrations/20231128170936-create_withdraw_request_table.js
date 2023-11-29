'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("withdraw_requests",
      {
        id: { type: Sequelize.INTEGER(11).UNSIGNED, autoIncrement: true, allowNull: false, primaryKey: true, },
        user_id: { type: Sequelize.INTEGER(11), allowNull: true },
        request_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
        accept_decline: { type: Sequelize.TINYINT(4), allowNull: true },
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
    await queryInterface.dropTable('withdraw_requests');
    /**
     * Add reverting commands here.
     *
     * Example:
     */
  }
};
