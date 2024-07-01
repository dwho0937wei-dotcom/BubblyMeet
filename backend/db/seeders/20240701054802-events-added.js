'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Events';

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
      "groupId": 1,
      "venueId": null,
      "name": "Tennis Group First Meet and Greet",
      "type": "Online",
      "startDate": "2021-11-19 20:00:00",
      "endDate": "2021-11-19 22:00:00",
      "numAttending": 8
    },
    {
      "groupId": 1,
      "venueId": 1,
      "name": "Tennis Singles",
      "type": "In Person",
      "startDate": "2021-11-20 20:00:00",
      "endDate": "2021-11-19 22:00:00",
      "numAttending": 4
    }
  ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Tennis Group First Meet and Greet', "Tennis Singles"] }
    });
  }
};
