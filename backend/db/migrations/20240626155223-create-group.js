'use strict';
/** @type {import('sequelize-cli').Migration} */

const { Op } = require('sequelize');

let options = {};
options.tableName = "Groups";
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(options, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(256),
        allowNull: false,
        validate: {
          len: [0, 60]
        }
      },
      about: {
        type: Sequelize.STRING(256),
        allowNull: true,
        validate: {
          len: [50, Infinity]
        }
      },
      type: {
        type: Sequelize.STRING(256),
        allowNull: true,
        validate: {
          isIn: [['Online', 'In person']]
        }
      },
      private: {
        type: Sequelize.BOOLEAN
      },
      city: {
        type: Sequelize.STRING(256),
        allowNull: false
      },
      state: {
        type: Sequelize.STRING(256),
        allowNull: false
      },
      numMembers: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(options);
  }
};