'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = "Attendances";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { Event, User } = require('../models');

const RoyalNavyMembers = [
  {
    firstName: "Prince",
    lastName: "Wales",
  },
  {
    firstName: "Repulse",
    lastName: "Navy",
  },
  {
    firstName: "Vampire",
    lastName: "Navy",
  },
  {
    firstName: "Rodney",
    lastName: "Navy",
  },
  {
    firstName: "Ark",
    lastName: "Royal",
  },
  {
    firstName: "Hermes",
    lastName: "Navy",
  },
];

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

    const findRoyalNavyMembers = [];
    for (const member of RoyalNavyMembers) {
      const findMember = await User.findOne({
        where: member
      });
      findRoyalNavyMembers.push(findMember);
    }

    await queryInterface.bulkInsert(options, [
      // Royal Navy Recruitment
      {
        "eventId": StriveEvent.id,
        "userId": findRoyalNavyMembers[0].id,
        "status": "host"
      },
      {
        "eventId": StriveEvent.id,
        "userId": findRoyalNavyMembers[1].id,
        "status": "co-host"
      },
      {
        "eventId": StriveEvent.id,
        "userId": findRoyalNavyMembers[2].id,
        "status": "attending"
      },
      {
        "eventId": StriveEvent.id,
        "userId": findRoyalNavyMembers[3].id,
        "status": "attending"
      },
      {
        "eventId": StriveEvent.id,
        "userId": findRoyalNavyMembers[4].id,
        "status": "attending"
      },
      {
        "eventId": StriveEvent.id,
        "userId": findRoyalNavyMembers[5].id,
        "status": "attending"
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
      "eventId": StriveEvent.id
    });
  }
};