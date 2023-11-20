'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable("users",
        {
          id: { type: Sequelize.INTEGER(11).UNSIGNED, autoIncrement: true, allowNull: false, primaryKey: true, },
          name: { type: Sequelize.STRING(50), allowNull: false },
          password: { type: Sequelize.STRING(100), allowNull: false },
          mobile_number: { type: Sequelize.STRING(50), allowNull: false },
          email: { type: Sequelize.STRING(50), allowNull: false },
          is_admin: { type: Sequelize.TINYINT(4), allowNull: true },
          auth_token: { type: Sequelize.STRING(255), allowNull: this.truncate },
          refresh_token: { type: Sequelize.STRING(255), allowNull: this.truncate },
          referral_code: { type: Sequelize.STRING, allowNull: true },
          referral_points: { type: Sequelize.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },

          //created,updated,deleted At:
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
