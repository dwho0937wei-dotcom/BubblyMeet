'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = "GroupImages";
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
      // Eagle Union
      {
        groupId: 4,
        url: 'https://static.wikia.nocookie.net/bhlx/images/b/b2/Eagle_Union-logo.png/revision/latest?cb=20230317170325',
        preview: true
      },
      // Royal Navy
      {
        groupId: 5,
        url: 'https://static.wikia.nocookie.net/bhlx/images/7/73/Royal_Navy-logo.png/revision/latest?cb=20230317170329',
        preview: true
      },
      // Sakura Empire
      {
        groupId: 6,
        url: 'https://static.wikia.nocookie.net/bhlx/images/2/25/Sakura_Empire-logo.png/revision/latest?cb=20230317170334',
        preview: true
      },
      // Iron Blood
      {
        groupId: 7,
        url: 'https://static.wikia.nocookie.net/bhlx/images/6/6e/Ironblood-logo.png/revision/latest?cb=20230317170338',
        preview: true
      },
      // Dragon Empery
      {
        groupId: 8,
        url: 'https://azurlane.netojuu.com/images/thumb/2/26/Cn_1.png/127px-Cn_1.png',
        preview: true
      },
      // Sardegna Empire
      {
        groupId: 9,
        url: 'https://static.wikia.nocookie.net/bhlx/images/d/de/Sardenga_Empire-logo.png/revision/latest?cb=20230317170203',
        preview: true
      },
      // Vichiya Dominion
      {
        groupId: 10,
        url: 'https://static.wikia.nocookie.net/bhlx/images/1/1f/Vichya_Dominion.png/revision/latest?cb=20230317165952',
        preview: true
      },
      // Iris Libre
      {
        groupId: 11,
        url: 'https://static.wikia.nocookie.net/bhlx/images/4/4d/Iris_Libre.png/revision/latest?cb=20230317170756',
        preview: true
      },
      // Northern Parliament
      {
        groupId: 12,
        url: 'https://static.wikia.nocookie.net/bhlx/images/8/88/Northern_Parliament-logo.png/revision/latest?cb=20230317170348',
        preview: true
      },
      // Siren
      {
        groupId: 13,
        url: 'https://pm1.aminoapps.com/8373/aa7bb2cd12ec83c1f86c0a161af002a5fda52d4ar1-886-588v2_00.jpg',
        preview: true
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
    await queryInterface.bulkDelete(options, {
      groupId: [4, 13]
    })
  }
};
