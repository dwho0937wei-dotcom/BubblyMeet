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
    const event1 = await Event.findOne({
      where: { name: "Tennis Group First Meet and Greet" }
    });
    const event2 = await Event.findOne({
      where: { name: "Tennis Singles" }
    })

    await queryInterface.bulkInsert(options, [
      {
        "eventId": event1.id,
        "url": "image_url",
        "preview": true
      },
      {
        "eventId": event2.id,
        "url": "image_url",
        "preview": true
      },
      // fake event images to be deleted
      {
        "eventId": event1.id,
        "url": "fake_url",
        "preview": false
      },
      {
        "eventId": event2.id,
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
    const event1 = await Event.findOne({
      where: { name: "Tennis Group First Meet and Greet" }
    });
    const event2 = await Event.findOne({
      where: { name: "Tennis Singles" }
    })

    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      "eventId": { [Op.in]: [event1.id, event2.id] }
    });
  }
};
