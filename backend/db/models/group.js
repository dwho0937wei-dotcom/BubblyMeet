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
      Group.hasMany(models.Event, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE'
      });
      Group.belongsTo(models.User, {
        foreignKey: 'organizerId',
        as: 'Organizer'
      });
      Group.belongsToMany(models.User, {
        through: models.Membership,
        foreignKey: 'groupId',
        otherKey: 'userId',
        as: 'Members'
      });
      Group.hasMany(models.Venue, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE'
      });
      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE'
      });
    }
  }
  Group.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    organizerId: {
      type: DataTypes.INTEGER,
      references: {model: 'Users'}
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 60]
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [50, Infinity]
      }
    },
    type: {
      type: DataTypes.ENUM('Online', 'In person'),
      allowNull: false,
      validate: {
        isIn: [['Online', 'In person']]
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        isIn: [[true, false]]
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
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};