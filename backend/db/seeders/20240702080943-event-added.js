'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = "Events";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { Group, Venue } = require('../models');

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
    const group1 = await Group.findOne({
      where: { name: "Evening Tennis on the Water" }
    });

    const venue1 = await Venue.findOne({
      where: { address: "123 Disney Lane" }
    });

    await queryInterface.bulkInsert(options, [
      {
        "groupId": group1.id,
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
        "groupId": group1.id,
        "venueId": venue1.id,
        "name": "Tennis Singles",
        "type": "In person",
        "startDate": "2021-11-20 20:00:00",
        "endDate": "2021-11-20 22:00:00",
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
    const group1 = await Group.findOne({
      where: { name: "Evening Tennis on the Water" }
    });

    if (group1) {
      await queryInterface.bulkDelete(options, {
        "groupId": group1.id,
        "capacity": 50,
        "price": 20
      });
    }
  }
};
