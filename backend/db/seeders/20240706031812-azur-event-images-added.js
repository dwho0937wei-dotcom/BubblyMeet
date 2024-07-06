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
        "eventId": 3,
        "url": "https://pbs.twimg.com/media/Edla45UU8AAO8vM.jpg",
        "preview": true
      },
      {
        "eventId": 3,
        "url": "https://azurlane.netojuu.com/images/thumb/d/df/Pow_tasks.png/300px-Pow_tasks.png",
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
      eventId: 3
    });
  }
};