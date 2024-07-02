'use strict';
/** @type {import('sequelize-cli').Migration} */

const bcrypt = require('bcryptjs');

let options = {};
options.tableName = "Users";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
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
        id: 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith",
        "hashedPassword": bcrypt.hashSync('password')
      },
      {
        id: 2,
        "firstName": "David",
        "lastName": "Smitheroon",
        "email": "dave.smitheroo@gmail.com",
        "username": "DaveyKun",
        "hashedPassword": bcrypt.hashSync('password2')
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
      email: { [Op.or]: ["john.smith@gmail.com", "dave.smitheroo@gmail.com"] }
    });
  }
};
