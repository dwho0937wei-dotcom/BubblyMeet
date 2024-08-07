"use strict";
const {
  Model
} = require("sequelize");
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
        foreignKey: "eventId",
        onDelete: "CASCADE"
      });
      Event.belongsTo(models.Venue, {
        foreignKey: "venueId"
      });
      Event.belongsTo(models.Group, {
        foreignKey: "groupId"
      });
      Event.belongsToMany(models.User,  {
        through: models.Attendance,
        foreignKey: "eventId",
        otherKey: "userId",
        as: "Attendee"
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
        model: "Venues"
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Groups"
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
      type: DataTypes.ENUM("Online", "In person", "In Person"),
      allowNull: false,
      validate: {
        isIn: [["Online", "In person", "In Person"]]
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
      type: DataTypes.FLOAT(21, 2),
      allowNull: false,
      validate: {
        isNumeric: true,
        twoDecimalPlacesMax(value) {
          const strValue = value.toString();
          const places = strValue.split(".");
          if (places[1].length > 2) {
            throw new Error("Price should NOT have more than two decimal places!")
          }
        }
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
            throw new Error("The end date must be after the start date.")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: "Event",
  });
  return Event;
};