'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.hasMany(models.Event, {
        foreignKey: 'venueId',
        onDelete: 'SET NULL'
      });
      Venue.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
    }
  }
  Venue.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Groups'
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true
      }
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -180,
        max: 180
      }
    }
  }, {
    sequelize,
    modelName: 'Venue',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Venue;
};