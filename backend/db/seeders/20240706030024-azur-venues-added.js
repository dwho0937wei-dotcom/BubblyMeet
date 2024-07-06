'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = "Venues";
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
        id: 2,
        "groupId": 5,
        "address": "Naval Command Base, Royal Navy Operations",
        "city": "Portsmouth",
        "state": "Hampshire (UK)",
        "lat": 50.7989,
        "lng": 1.0912
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
      id: 2
    });
  }
};
