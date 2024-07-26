'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = "EventImages";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { Event } = require('../models');

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
    const StriveEvent = await Event.findOne({
      where: { name: "Strive, Wish, and Strategize" }
    });

    await queryInterface.bulkInsert(options, [
      {
        "eventId": StriveEvent.id,
        "url": "https://pbs.twimg.com/media/Edla45UU8AAO8vM.jpg",
        "preview": true
      },
      {
        "eventId": StriveEvent.id,
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
    const StriveEvent = await Event.findOne({
      where: { name: "Strive, Wish, and Strategize" }
    });

    await queryInterface.bulkDelete(options, {
      eventId: StriveEvent.id
    });
  }
};