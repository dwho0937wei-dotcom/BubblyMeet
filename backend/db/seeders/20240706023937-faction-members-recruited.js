'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = "Memberships";
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
    // Eagle Union Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: 3,
        groupId: 4,
        status: 'co-host'
      },
      {
        userId: 19,
        groupId: 4,
        status: 'pending'
      },
      {
        userId: 20,
        groupId: 4,
        status: 'pending'
      }
    ])

    // Royal Navy Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: 4,
        groupId: 5,
        status: 'co-host'
      },
      {
        userId: 13,
        groupId: 5,
        status: 'member'
      },
      {
        userId: 14,
        groupId: 5,
        status: 'member'
      },
      {
        userId: 15,
        groupId: 5,
        status: 'member'
      },
      {
        userId: 16,
        groupId: 5,
        status: 'member'
      },
      {
        userId: 17,
        groupId: 5,
        status: 'member'
      },
      {
        userId: 18,
        groupId: 5,
        status: 'member'
      },
    ]);

    // Sakura Empire Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: 5,
        groupId: 6,
        status: 'co-host'
      }
    ])

    // Iron Blood Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: 6,
        groupId: 7,
        status: 'co-host'
      }
    ])

    // Dragon Empery Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: 7,
        groupId: 8,
        status: 'co-host'
      }
    ])

    // Sardegna Empire Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: 8,
        groupId: 9,
        status: 'co-host'
      }
    ])

    // Vichya Dominion Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: 9,
        groupId: 10,
        status: 'co-host'
      }
    ])

    // Iris Libre Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: 10,
        groupId: 11,
        status: 'co-host'
      }
    ])

    // Northern Parliament Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: 11,
        groupId: 12,
        status: 'co-host'
      }
    ])

    // Siren Recruitment
    await queryInterface.bulkInsert(options, [
      {
        userId: 12,
        groupId: 13,
        status: 'co-host'
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
    await queryInterface.bulkDelete(options, {
      groupId: { [Op.between]: [4, 13] }
    });
  }
};
