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
      Event.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });
      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId'
      });
      Event.belongsToMany(models.User, {
        through: models.Attendant,
        foreignKey: 'eventId',
        otherKey: 'userId'
      });
      Event.hasMany(models.Image, {
        foreignKey: 'eventId'
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
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    venueId: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, Infinity]
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: ['Online', 'In person']
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    },
    price: {
      type: DataTypes.NUMERIC,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    numAttending: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};