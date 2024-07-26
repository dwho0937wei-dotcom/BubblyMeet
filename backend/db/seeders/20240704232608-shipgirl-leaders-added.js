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
        firstName: "Grey",
        lastName: "Ghost",
        email: "grey.ghost@azurL.io",
        username: "Enterprise",
        hashedPassword: bcrypt.hashSync('azurPassword1')
      },
      // Royal Navy Leader
      {
        firstName: "Queen",
        lastName: "Elizabeth",
        email: "queen.elizabeth@azurL.io",
        username: "Tyrannical",
        hashedPassword: bcrypt.hashSync('azurPassword2')
      },
      // Sakura Empire Leader
      {
        firstName: "Nagato",
        lastName: "Sakura",
        email: "nagato.sakura@azurL.io",
        username: "TheEmpress",
        hashedPassword: bcrypt.hashSync('azurPassword3')
      },
      // Iron Blood Leader
      {
        firstName: "Bismarck",
        lastName: "IronBlood",
        email: "bismarck.ironblood@azurL.io",
        username: "Stoicism",
        hashedPassword: bcrypt.hashSync('azurPassword4')
      },
      // Dragon Empery Leader
      {
        firstName: "Yat",
        lastName: "Sen",
        email: "yat.sen@azurL.io",
        username: "RepublicChina",
        hashedPassword: bcrypt.hashSync('azurPassword5')
      },
      // Sardegna Empire Leader
      {
        firstName: "Vittorio",
        lastName: "Veneto",
        email: "vittorio.veneto@azurL.io",
        username: "EternalLight",
        hashedPassword: bcrypt.hashSync('azurPassword6')
      },
      // Vichya Dominion Leader
      {
        firstName: "Jean",
        lastName: "Bart",
        email: "jean.bart@azurL.io",
        username: "PirateSoul",
        hashedPassword: bcrypt.hashSync('azurPassword7')
      },
      // Iris Libre Leader
      {
        firstName: "Richelieu",
        lastName: "Libre",
        email: "richelieu.libre@azurL.io",
        username: "HolyFlame",
        hashedPassword: bcrypt.hashSync('azurPassword8')
      },
      // Northern Parliament Leader
      {
        firstName: "Sovetsky",
        lastName: "Soyuz",
        email: "sovetsky.soyuz@azurL.io",
        username: "SunderAllStorm",
        hashedPassword: bcrypt.hashSync('azurPassword9')
      },
      // Siren Leader
      {
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
