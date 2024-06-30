'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Group } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Groups';

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

    await queryInterface.bulkInsert('Groups', [{
      "organizerId": 1,
      "name": "Evening Tennis on the Water",
      "about": "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
      "type": "In person",
      "private": true,
      "city": "New York",
      "state": "NY",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36",
      "numMembers": 10,
      "previewImage": "image url",
    }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, {
      name: { [Op.in]: "Evening Tennis on the Water" }
    }, {});
  }
};
