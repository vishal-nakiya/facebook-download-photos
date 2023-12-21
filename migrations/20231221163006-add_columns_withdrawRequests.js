'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      Promise.all([
        await queryInterface.addColumn( 'withdraw_requests', 'account_holder_name', { type: Sequelize.STRING(150), allowNull: true }),

        await queryInterface.addColumn( 'withdraw_requests', 'account_number', { type: Sequelize.STRING(50), allowNull: true }),

        await queryInterface.addColumn( 'withdraw_requests', 'ifsc_code', { type: Sequelize.STRING(40), allowNull: true }),

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