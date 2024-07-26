'use strict';

let options = {};
options.tableName = "Groups";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { User } = require('../models');

/** @type {import('sequelize-cli').Migration} */
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
    const organizer = await User.findOne({
      where: { email: "john.smith@gmail.com" }
    });

    await queryInterface.bulkInsert(options, [
      {
        "organizerId": organizer.id,
        "name": "Evening Tennis on the Water",
        "about": "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
        "type": "In person",
        "private": true,
        "city": "New York",
        "state": "NY",
        "createdAt": "2021-11-19 20:39:36",
        "updatedAt": "2021-11-19 20:39:36"
      },
      {
        "organizerId": organizer.id,
        "name": "Playing Soccer on the Water",
        "about": "Enjoy rounds of soccer with a tight-nit group of people on the water facing the Brooklyn Bridge. Kick, Run, Kick!",
        "type": "In person",
        "private": true,
        "city": "New York",
        "state": "NY",
        "createdAt": "2021-11-19 20:39:36",
        "updatedAt": "2021-11-19 20:39:36"
      },
      {
        "organizerId": organizer.id,
        "name": "Playing Basketball on the Water",
        "about": "Enjoy rounds of basketball with a tight-nit group of people on the water facing the Brooklyn Bridge. Dribble Dribble Dribble.",
        "type": "In person",
        "private": true,
        "city": "New York",
        "state": "NY",
        "createdAt": "2021-11-19 20:39:36",
        "updatedAt": "2021-11-19 20:39:36"
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
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      name: { [Op.endsWith]: "on the Water" } 
    });
  }
};
