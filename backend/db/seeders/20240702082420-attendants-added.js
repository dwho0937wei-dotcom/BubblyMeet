'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = "Attendances";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { Event, User } = require('../models');

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const event1 = await Event.findOne({
      where: { name: "Tennis Group First Meet and Greet" }
    });
    const user1 = await User.findOne({
      where: { email: "john.smith@gmail.com" }
    });

    await queryInterface.bulkInsert(options, [
      {
        "eventId": event1.id,
        "userId": user1.id,
        "status": "host"
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const event1 = await Event.findOne({
      where: { name: "Tennis Group First Meet and Greet" }
    });
    const user1 = await User.findOne({
      where: { email: "john.smith@gmail.com" }
    });

    await queryInterface.bulkDelete(options, {
      "eventId": event1.id,
      "userId": user1.id,
      "status": "host"
    });
  }
};