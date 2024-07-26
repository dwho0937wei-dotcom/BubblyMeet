'use strict';

let options = {};
options.tableName = "GroupImages";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { Group } = require('../models');

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
    const group1 = await Group.findOne({
      where: { name: "Evening Tennis on the Water" }
    });

    await queryInterface.bulkInsert(options, [
      {
        groupId: group1.id,
        url: 'image url',
        preview: true
      },
      // fake group images to be deleted
      {
        groupId: group1.id,
        url: 'fake url',
        preview: false
      },
      {
        groupId: group1.id,
        url: 'fake url2',
        preview: false
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

    await queryInterface.bulkDelete(options, {
      groupId: group1.id
    });
  }
};