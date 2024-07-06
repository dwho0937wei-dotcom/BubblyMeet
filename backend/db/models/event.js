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
      });
      Event.belongsToMany(models.User,  {
        through: models.Attendance,
        foreignKey: 'eventId',
        otherKey: 'userId',
        as: 'Attendees'
      });
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, Infinity]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: true
      }
    },
    type: {
      type: DataTypes.ENUM('Online', 'In person'),
      allowNull: false,
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
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: new Date().toISOString()
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isFuture(value) {
          if (new Date(value) <= new Date(this.startDate)) {
            throw new Error('The end date must be after the start date.')
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};