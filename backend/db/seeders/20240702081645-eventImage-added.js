'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = "EventImages";
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
        "eventId": 1,
        "url": "image_url",
        "preview": true
      },
      {
        "eventId": 2,
        "url": "image_url",
        "preview": true
      },
      // fake event images to be deleted
      {
        "eventId": 1,
        "url": "fake_url",
        "preview": false
      },
      {
        "eventId": 2,
        "url": "fake_url",
        "preview": false
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
      "url": "image_url",
      "preview": true
    });
  }
};
