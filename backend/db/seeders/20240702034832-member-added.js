'use strict';

let options = {};
options.tableName = "Memberships";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { User, Group } = require('../models');

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

    const group1 = await Group.findOne({
      where: { name: "Evening Tennis on the Water" }
    });
    const group2 = await Group.findOne({
      where: { name: "Playing Soccer on the Water" }
    });
    const group3 = await Group.findOne({
      where: { name: "Playing Basketball on the Water" }
    });

    await queryInterface.bulkInsert(options, [
      {
        userId: organizer.id,
        groupId: group1.id,
        status: 'host'
      },
      {
        userId: organizer.id,
        groupId: group2.id,
        status: 'host'
      },
      {
        userId: organizer.id,
        groupId: group3.id,
        status: 'host'
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
    const organizer = await User.findOne({
      where: { email: "john.smith@gmail.com" }
    });

    await queryInterface.bulkDelete(options, {
      userId: organizer.id
    });
  }
};
