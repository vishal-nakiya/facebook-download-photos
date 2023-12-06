'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.changeColumn('zodiacs', 'order', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.changeColumn('zodiacs', 'image', { type: Sequelize.STRING(200), allowNull: true });

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
