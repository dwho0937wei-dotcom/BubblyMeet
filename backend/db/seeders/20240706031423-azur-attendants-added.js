'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = "Attendances";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

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
    await queryInterface.bulkInsert(options, [
      {
        "eventId": 3,
        "userId": 13,
        "status": "host"
      },
      {
        "eventId": 3,
        "userId": 14,
        "status": "co-host"
      },
      {
        "eventId": 3,
        "userId": 15,
        "status": "attendee"
      },
      {
        "eventId": 3,
        "userId": 16,
        "status": "attendee"
      },
      {
        "eventId": 3,
        "userId": 17,
        "status": "attendee"
      },
      {
        "eventId": 3,
        "userId": 18,
        "status": "attendee"
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
    await queryInterface.bulkDelete(options, {
      "eventId": 3
    });
  }
};