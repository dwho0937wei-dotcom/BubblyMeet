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
        "firstName": "Prince",
        "lastName": "Wales",
        "email": "prince.wales@azur.io",
        "username": "PrinceOfWales",
        "hashedPassword": bcrypt.hashSync('azurPassword12')
      },
      {
        "firstName": "Repulse",
        "lastName": "Navy",
        "email": "repulse.navy@azur.io",
        "username": "RepulseNavy",
        "hashedPassword": bcrypt.hashSync('azurPassword13')
      },
      {
        "firstName": "Vampire",
        "lastName": "Navy",
        "email": "vampire.navy@azur.io",
        "username": "VampireNavy",
        "hashedPassword": bcrypt.hashSync('azurPassword14')
      },
      {
        "firstName": "Rodney",
        "lastName": "Navy",
        "email": "rodney.navy@azur.io",
        "username": "RodneyNavy",
        "hashedPassword": bcrypt.hashSync('azurPassword15')
      },
      {
        "firstName": "Ark",
        "lastName": "Royal",
        "email": "ark.royal@azur.io",
        "username": "ArkRoyal",
        "hashedPassword": bcrypt.hashSync('azurPassword16')
      },
      {
        "firstName": "Hermes",
        "lastName": "Navy",
        "email": "hermes.navy@azur.io",
        "username": "HermesNavy",
        "hashedPassword": bcrypt.hashSync('azurPassword17')
      },

      // Eagle Union Non-Event Characters
      {
        "firstName": "Georgia",
        "lastName": "Union",
        "email": "georgia.union@azur.io",
        "username": "GeorgiaUnion",
        "hashedPassword": bcrypt.hashSync('azurPassword18')
      },
      {
        "firstName": "Laffey",
        "lastName": "Union",
        "email": "laffey.union@azur.io",
        "username": "LaffeyUnion",
        "hashedPassword": bcrypt.hashSync('azurPassword19')
      },

      // Sakura Empire Non-Event Characters
      {
        "firstName": "Ibuki",
        "lastName": "Sakura",
        "email": "ibuki.sakura@azur.io",
        "username": "IbukiSakura",
        "hashedPassword": bcrypt.hashSync('azurPassword20')
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
      email: { [Op.endsWith]: '@azur.io' }
    });
  }
};
