'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE'
      });
      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId'
      });
      Event.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
    }
  }
  Event.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    venueId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Venues'
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Groups'
      }
    },
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.ENUM('Online', 'In person')
    },
    capacity: {
      type: DataTypes.INTEGER
    },
    price: {
      type: DataTypes.INTEGER
    },
    startDate: {
      type: DataTypes.DATE
    },
    endDate: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};