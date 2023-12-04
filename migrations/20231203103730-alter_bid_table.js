'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    Promise.all([
      await queryInterface.addColumn('bids', 'is_win', { type: Sequelize.TINYINT(4), allowNull: true, defaultValue: 0, after: "date" }),
    ]);

  },
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};