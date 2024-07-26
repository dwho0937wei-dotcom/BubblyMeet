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
    const RoyalNavy = await Group.findOne({
      where: { name: "Royal Navy" }
    });
    const NavalCommandBase = await Venue.findOne({
      where: { address: "Naval Command Base, Royal Navy Operations" }
    });

    await queryInterface.bulkInsert(options, [
      {
        groupId: RoyalNavy.id,
        venueId: NavalCommandBase.id,
        name: "Strive, Wish, and Strategize",
        type: "In person",
        startDate: "2018-09-13 00:00:00",
        endDate: "2018-09-30 00:00:00",
        description: 'The event "Strive, Wish, and Strategize" in Azur Lane presents a critical period for the Royal Navy, focusing on their strategic maneuvers and the resilience of their fleet. Set against the backdrop of escalating tensions with the Sakura Empire and Iron Blood, the Royal Navy shipgirls are tasked with safeguarding their interests and showcasing their naval prowess.',
        capacity: 50,
        price: 20
      },
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
      name: "Strive, Wish, and Strategize"
    });
  }
};

