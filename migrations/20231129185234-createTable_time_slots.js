'use strict';

const TimeSlot = require('../Models/TimeSlot');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("time_slots", {
      id: { type: Sequelize.INTEGER(11).UNSIGNED, autoIncrement: true, allowNull: false, primaryKey: true },
      start_time: { type: Sequelize.TIME, allowNull: false },
      end_time: { type: Sequelize.TIME, allowNull: false },
      created_at: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updated_at: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

      // Generate time slots with a 5-minute gap
      const startTime = new Date('2023-01-01T00:00:00Z');
      const endTime = new Date('2023-01-01T00:05:00Z');
      const timeSlots = [];

      while (endTime <= new Date('2023-01-02T00:00:00Z')) {
        timeSlots.push({
          start_time: startTime.toISOString().split('T')[1].slice(0, -1),
          end_time: endTime.toISOString().split('T')[1].slice(0, -1),
          created_at: new Date(),
          updated_at: new Date()
        });

        startTime.setMinutes(startTime.getMinutes() + 5);
        endTime.setMinutes(endTime.getMinutes() + 5);
      }

      // Insert generated time slots into the database
      await queryInterface.bulkInsert('time_slots', timeSlots, {});
  },

  async down(queryInterface, Sequelize) {
    await TimeSlot.destroy({
      where: {
        start_time: '00:00:00',
        end_time: '00:05:00',
      },
    });

    await queryInterface.dropTable('time_slots');
    /**
     * Add reverting commands here.
     *
     * Example:
     */
  }
};
