'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = "Memberships";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { User, Group } = require('../models');

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
    const EagleUnionLeader = await User.findOne({
      where: { email: "grey.ghost@azurL.io" }
    });
    const EagleUnionMember1 = await User.findOne({
      where: { email: "georgia.union@azur.io" }
    });
    const EagleUnionMember2 = await User.findOne({
      where: { email: "laffey.union@azur.io" }
    });
    
    const RoyalNavy = await Group.findOne({
      where: { name: "Royal Navy" }
    });
    const RoyalNavyLeader = await User.findOne({
      where: { email: "queen.elizabeth@azurL.io" }
    });
    const RoyalNavyMember1 = await User.findOne({
      where: { email: "prince.wales@azur.io" }
    });
    const RoyalNavyMember2 = await User.findOne({
      where: { email: "repulse.navy@azur.io" }
    });
    const RoyalNavyMember3 = await User.findOne({
      where: { email: "vampire.navy@azur.io" }
    });
    const RoyalNavyMember4 = await User.findOne({
      where: { email: "rodney.navy@azur.io" }
    });
    const RoyalNavyMember5 = await User.findOne({
      where: { email: "ark.royal@azur.io" }
    });
    const RoyalNavyMember6 = await User.findOne({
      where: { email: "hermes.navy@azur.io" }
    });
    
    const SakuraEmpire = await Group.findOne({
      where: { name: "Sakura Empire" }
    });
    const SakuraEmpireLeader = await User.findOne({
      where: { email: "nagato.sakura@azurL.io" }
    });
    
    const IronBlood = await Group.findOne({
      where: { name: "Iron Blood" }
    });
    const IronBloodLeader = await User.findOne({
      where: { email: "bismarck.ironblood@azurL.io", }
    });
    
    const DragonEmpery = await Group.findOne({
      where: { name: "Dragon Empery" }
    });
    const DragonEmperyLeader = await User.findOne({
      where: { email: "yat.sen@azurL.io" }
    });
    
    const SardegnaEmpire = await Group.findOne({
      where: { name: "Sardegna Empire" }
    });
    const SardegnaEmpireLeader = await User.findOne({
      where: { email: "vittorio.veneto@azurL.io" }
    });
    
    const VichyaDominion = await Group.findOne({
      where: { name: "Vichya Dominion" }
    });
    const VichyaDominionLeader = await User.findOne({
      where: { email: "jean.bart@azurL.io" }
    });
    
    const IrisLibre = await Group.findOne({
      where: { name: "Iris Libre" }
    });
    const IrisLibreLeader = await User.findOne({
      where: { email: "richelieu.libre@azurL.io" }
    });
    
    const NorthernParliament = await Group.findOne({
      where: { name: "Northern Parliament" }
    });
    const NorthernParliamentLeader = await User.findOne({
      where: { email: "sovetsky.soyuz@azurL.io" }
    });
    
    const Siren = await Group.findOne({
      where: { name: "Siren" }
    });
    const SirenLeader = await User.findOne({
      where: { email: "observer.alpha@azurL.io" }
    });

    // Eagle Union Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: EagleUnionLeader.id,
        groupId: EagleUnion.id,
        status: 'host'
      },
      {
        userId: EagleUnionMember1.id,
        groupId: EagleUnion.id,
        status: 'pending'
      },
      {
        userId: EagleUnionMember2.id,
        groupId: EagleUnion.id,
        status: 'pending'
      }
    ])

    // Royal Navy Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: RoyalNavyLeader.id,
        groupId: RoyalNavy.id,
        status: 'host'
      },
      {
        userId: RoyalNavyMember1.id,
        groupId: RoyalNavy.id,
        status: 'member'
      },
      {
        userId: RoyalNavyMember2.id,
        groupId: RoyalNavy.id,
        status: 'member'
      },
      {
        userId: RoyalNavyMember3.id,
        groupId: RoyalNavy.id,
        status: 'member'
      },
      {
        userId: RoyalNavyMember4.id,
        groupId: RoyalNavy.id,
        status: 'member'
      },
      {
        userId: RoyalNavyMember5.id,
        groupId: RoyalNavy.id,
        status: 'member'
      },
      {
        userId: RoyalNavyMember6.id,
        groupId: RoyalNavy.id,
        status: 'member'
      },
    ]);

    // Sakura Empire Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: SakuraEmpireLeader.id,
        groupId: SakuraEmpire.id,
        status: 'host'
      }
    ])

    // Iron Blood Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: IronBloodLeader.id,
        groupId: IronBlood.id,
        status: 'host'
      }
    ])

    // Dragon Empery Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: DragonEmperyLeader.id,
        groupId: DragonEmpery.id,
        status: 'host'
      }
    ])

    // Sardegna Empire Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: SardegnaEmpireLeader.id,
        groupId: SardegnaEmpire.id,
        status: 'host'
      }
    ])

    // Vichya Dominion Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: VichyaDominionLeader.id,
        groupId: VichyaDominion.id,
        status: 'host'
      }
    ])

    // Iris Libre Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: IrisLibreLeader.id,
        groupId: IrisLibre.id,
        status: 'host'
      }
    ])

    // Northern Parliament Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: NorthernParliamentLeader.id,
        groupId: NorthernParliament.id,
        status: 'host'
      }
    ])

    // Siren Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: SirenLeader.id,
        groupId: Siren.id,
        status: 'host'
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
    const EagleUnion = await Group.findOne({
      where: { name: "Eagle Union" }
    });
    const Siren = await Group.findOne({
      where: { name: "Siren" }
    });

    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      groupId: { [Op.between]: [EagleUnion.id, Siren.id] }
    });
  }
};
