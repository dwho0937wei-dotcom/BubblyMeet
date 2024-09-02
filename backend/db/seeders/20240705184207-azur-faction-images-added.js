'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = "GroupImages";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { Group } = require('../models');

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
    const EagleUnion = await Group.findOne({
      where: { name: "Eagle Union" }
    });
    const RoyalNavy = await Group.findOne({
      where: { name: "Royal Navy" }
    });
    const SakuraEmpire = await Group.findOne({
      where: { name: "Sakura Empire" }
    });
    const IronBlood = await Group.findOne({
      where: { name: "Iron Blood" }
    });
    const DragonEmpery = await Group.findOne({
      where: { name: "Dragon Empery" }
    });
    const SardegnaEmpire = await Group.findOne({
      where: { name: "Sardegna Empire" }
    });
    const VichyaDominion = await Group.findOne({
      where: { name: "Vichya Dominion" }
    });
    const IrisLibre = await Group.findOne({
      where: { name: "Iris Libre" }
    });
    const NorthernParliament = await Group.findOne({
      where: { name: "Northern Parliament" }
    });
    const Siren = await Group.findOne({
      where: { name: "Siren" }
    });

    await queryInterface.bulkInsert(options, [
      // Eagle Union
      {
        groupId: EagleUnion.id,
        url: 'https://static.wikia.nocookie.net/bhlx/images/b/b2/Eagle_Union-logo.png',
        // url: 'https://ih1.redbubble.net/image.5177741507.0536/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg',
        preview: true
      },
      // Royal Navy
      {
        groupId: RoyalNavy.id,
        url: 'https://static.wikia.nocookie.net/bhlx/images/7/73/Royal_Navy-logo.png',
        // url: 'https://ih1.redbubble.net/image.5177719478.9851/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg',
        preview: true
      },
      // Sakura Empire
      {
        groupId: SakuraEmpire.id,
        url: 'https://static.wikia.nocookie.net/bhlx/images/2/25/Sakura_Empire-logo.png',
        // url: 'https://ih1.redbubble.net/image.5177798184.2325/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg',
        preview: true
      },
      // Iron Blood
      {
        groupId: IronBlood.id,
        url: 'https://static.wikia.nocookie.net/bhlx/images/6/6e/Ironblood-logo.png',
        // url: 'https://ih1.redbubble.net/image.1705336988.4230/flat,750x,075,f-pad,750x1000,f8f8f8.jpg',
        preview: true
      },
      // Dragon Empery
      {
        groupId: DragonEmpery.id,
        url: 'https://azurlane.netojuu.com/images/thumb/2/26/Cn_1.png/127px-Cn_1.png',
        preview: true
      },
      // Sardegna Empire
      {
        groupId: SardegnaEmpire.id,
        url: 'https://static.wikia.nocookie.net/bhlx/images/d/de/Sardenga_Empire-logo.png',
        // url: 'https://i.redd.it/2mtpyr7tzj771.png',
        preview: true
      },
      // Vichya Dominion
      {
        groupId: VichyaDominion.id,
        url: 'https://static.wikia.nocookie.net/bhlx/images/1/1f/Vichya_Dominion.png',
        // url: 'https://pm1.aminoapps.com/7987/a59d703b16bf8323227c3695f5ac968da89e0a6fr1-224-224v2_00.jpg',
        preview: true
      },
      // Iris Libre
      {
        groupId: IrisLibre.id,
        url: 'https://static.wikia.nocookie.net/bhlx/images/4/4d/Iris_Libre.png',
        // url: 'https://i.redd.it/avdz84itej771.png',
        preview: true
      },
      // Northern Parliament
      {
        groupId: NorthernParliament.id,
        url: 'https://static.wikia.nocookie.net/bhlx/images/8/88/Northern_Parliament-logo.png',
        // url: 'https://ih1.redbubble.net/image.5385148257.7028/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg',
        preview: true
      },
      // Siren
      {
        groupId: Siren.id,
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
    const EagleUnion = await Group.findOne({
      where: { name: "Eagle Union" }
    });
    const Siren = await Group.findOne({
      where: { name: "Siren" }
    });

    if (EagleUnion && Siren) {
      await queryInterface.bulkDelete(options, {
        groupId: [EagleUnion.id, Siren.id]
      })
    }
  }
};
