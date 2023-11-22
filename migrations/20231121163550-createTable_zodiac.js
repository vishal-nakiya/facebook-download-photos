'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable("zodiacs",
        {
          id: { type: Sequelize.INTEGER(11).UNSIGNED, autoIncrement: true, allowNull: false, primaryKey: true, },
          name: { type: Sequelize.STRING(50), allowNull: false },
          status: { type: Sequelize.TINYINT(4), allowNull: false },
          order: { type: Sequelize.TINYINT(4), allowNull: false },
          image: { type: Sequelize.STRING(200), allowNull: false },

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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
    /**
     * Add reverting commands here.
     *
     * Example:
     */
  }
};
