'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payment_credentials",
      {
        id: { type: Sequelize.INTEGER(11).UNSIGNED, autoIncrement: true, allowNull: false, primaryKey: true },
        upi_id: { type: Sequelize.STRING, allowNull: true },
        merchant_name: { type: Sequelize.STRING, allowNull: true },
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
    await queryInterface.dropTable('upi_table');
    /**
     * Add reverting commands here.
     *
     * Example:
     */
  }
};
