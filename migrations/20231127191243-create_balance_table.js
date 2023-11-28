'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("wallet_balances",
      {
        id: { type: Sequelize.INTEGER(11).UNSIGNED, autoIncrement: true, allowNull: false, primaryKey: true, },
        user_id: { type: Sequelize.INTEGER(11), allowNull: true },
        debit_credit: { type: Sequelize.TINYINT(4), allowNull: true },
        amount: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
        running_balance: { type: Sequelize.DECIMAL(15, 2), allowNull: true },
        comment: { type: Sequelize.STRING, allowNull: true },

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

        deleted_at: { type: Sequelize.DATE, allowNull: true },
      }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('balances');
    /**
     * Add reverting commands here.
     *
     * Example:
     */
  }
};
