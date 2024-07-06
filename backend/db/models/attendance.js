'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Attendance.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    eventId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Events'
      },
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users'
      },
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.ENUM('attendee', 'host', 'co-host'),
      allowNull: false,
      validate: {
        isIn: [['attendee', 'host', 'co-host']] 
      }
    },
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};