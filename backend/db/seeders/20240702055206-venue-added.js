'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = "Venues";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { Group } = require('../models');

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

    await queryInterface.bulkInsert(options, [
      {
        "groupId": group1.id,
        "address": "123 Disney Lane",
        "city": "New York",
        "state": "NY",
        "lat": 37.7645358,
        "lng": -122.4730327
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
        "address": "123 Disney Lane",
        "city": "New York",
        "state": "NY",
        "lat": 37.7645358,
        "lng": -122.4730327
      });
    }
  }
};