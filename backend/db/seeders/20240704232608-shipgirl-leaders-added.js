'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */

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
      // Eagle Union Leader
      {
        id: 3,
        firstName: "Grey",
        lastName: "Ghost",
        email: "grey.ghost@azurL.io",
        username: "Enterprise",
        hashedPassword: bcrypt.hashSync('azurPassword1')
      },
      // Royal Navy Leader
      {
        id: 4,
        firstName: "Queen",
        lastName: "Elizabeth",
        email: "queen.elizabeth@azurL.io",
        username: "Tyrannical",
        hashedPassword: bcrypt.hashSync('azurPassword2')
      },
      // Sakura Empire Leader
      {
        id: 5,
        firstName: "Nagato",
        lastName: "Sakura",
        email: "nagato.sakura@azurL.io",
        username: "TheEmpress",
        hashedPassword: bcrypt.hashSync('azurPassword3')
      },
      // Iron Blood Leader
      {
        id: 6,
        firstName: "Bismarck",
        lastName: "IronBlood",
        email: "bismarck.ironblood@azurL.io",
        username: "Stoicism",
        hashedPassword: bcrypt.hashSync('azurPassword4')
      },
      // Dragon Empery Leader
      {
        id: 7,
        firstName: "Yat",
        lastName: "Sen",
        email: "yat.sen@azurL.io",
        username: "RepublicChina",
        hashedPassword: bcrypt.hashSync('azurPassword5')
      },
      // Sardegna Empire Leader
      {
        id: 8,
        firstName: "Vittorio",
        lastName: "Veneto",
        email: "vittorio.veneto@azurL.io",
        username: "EternalLight",
        hashedPassword: bcrypt.hashSync('azurPassword6')
      },
      // Vichya Dominion Leader
      {
        id: 9,
        firstName: "Jean",
        lastName: "Bart",
        email: "jean.bart@azurL.io",
        username: "PirateSoul",
        hashedPassword: bcrypt.hashSync('azurPassword7')
      },
      // Iris Libre Leader
      {
        id: 10,
        firstName: "Richelieu",
        lastName: "Libre",
        email: "richelieu.libre@azurL.io",
        username: "HolyFlame",
        hashedPassword: bcrypt.hashSync('azurPassword8')
      },
      // Northern Parliament Leader
      {
        id: 11,
        firstName: "Sovetsky",
        lastName: "Soyuz",
        email: "sovetsky.soyuz@azurL.io",
        username: "SunderAllStorm",
        hashedPassword: bcrypt.hashSync('azurPassword9')
      },
      // Siren Leader
      {
        id: 12,
        firstName: "Observer",
        lastName: "Alpha",
        email: "observer.alpha@azurL.io",
        username: "ObserverAlpha",
        hashedPassword: bcrypt.hashSync('azurPassword11')
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
      email: { [Op.endsWith]: '@azurL.io' }
    });
  }
};
