'use strict';
/** @type {import('sequelize-cli').Migration} */

const bcrypt = require('bcryptjs');

let options = {};
options.tableName = "Users";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
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
      // Strive, Wish, and Strategize Royal Navy characters
      {
        "id": 13,
        "firstName": "Prince",
        "lastName": "Wales",
        "email": "prince.wales@azur.io",
        "username": "PrinceOfWales",
        "hashedPassword": bcrypt.hashSync('azurPassword12')
      },
      {
        "id": 14,
        "firstName": "Repulse",
        "lastName": "Navy",
        "email": "repulse.navy@azur.io",
        "username": "RepulseNavy",
        "hashedPassword": bcrypt.hashSync('azurPassword13')
      },
      {
        "id": 15,
        "firstName": "Vampire",
        "lastName": "Navy",
        "email": "vampire.navy@azur.io",
        "username": "VampireNavy",
        "hashedPassword": bcrypt.hashSync('azurPassword14')
      },
      {
        "id": 16,
        "firstName": "Rodney",
        "lastName": "Navy",
        "email": "rodney.navy@azur.io",
        "username": "RodneyNavy",
        "hashedPassword": bcrypt.hashSync('azurPassword15')
      },
      {
        "id": 17,
        "firstName": "Ark",
        "lastName": "Royal",
        "email": "ark.royal@azur.io",
        "username": "ArkRoyal",
        "hashedPassword": bcrypt.hashSync('azurPassword16')
      },
      {
        "id": 18,
        "firstName": "Hermes",
        "lastName": "Navy",
        "email": "hermes.navy@azur.io",
        "username": "HermesNavy",
        "hashedPassword": bcrypt.hashSync('azurPassword17')
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
    await queryInterface.bulkDelete(options, {
      email: { [Op.endsWith]: '@azur.io' }
    });
  }
};
