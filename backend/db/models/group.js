'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsToMany(models.User, {
        through: models.Member,
        foreignKey: 'groupId',
        otherKey: 'userId'
      });
      Group.hasMany(models.Image, {
        foreignKey: 'groupId'
      });
      Group.hasMany(models.Event, {
        foreignKey: 'groupId'
      });
      Group.hasMany(models.Venue, {
        foreignKey: 'groupId'
      })
    }
  }
  Group.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true
    },
    about: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    private: {
      type: DataTypes.BOOLEAN
    },
    city: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    numMembers: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};