'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      Promise.all([
        await queryInterface.addColumn( 'users', 'status', { type: Sequelize.TINYINT, allowNull: false,  defaultValue: 1 }),
      ]);
      
  },
  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};