'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = "Events";
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
        // id: 1,
        "groupId": 1,
        "venueId": null,
        "name": "Tennis Group First Meet and Greet",
        "type": "Online",
        "startDate": "2021-11-19 20:00:00",
        "endDate": "2021-11-19 22:00:00",
        "description": "This is a fun Tennis Group First Meet and Greet",
        "capacity": 50,
        "price": 20
      },
      {
        // id: 2,
        "groupId": 1,
        "venueId": 1,
        "name": "Tennis Singles",
        "type": "In person",
        "startDate": "2021-11-20 20:00:00",
        "endDate": "2021-11-19 22:00:00",
        "description": "This is a fun Tennis Singles",
        "capacity": 50,
        "price": 20
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
      "groupId": 1,
      "capacity": 50,
      "price": 20
    });
  }
};
