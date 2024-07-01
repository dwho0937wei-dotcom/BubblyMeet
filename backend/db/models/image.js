'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });
      Image.belongsTo(models.Event, {
        foreignKey: 'eventId'
      });
    }
  }
  Image.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preview: {
      type: DataTypes.BOOLEAN
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {model: 'Groups'}
    },
    eventId: {
      type: DataTypes.INTEGER,
      onDelete: 'SET NULL',
      defaultValue: null,
      references: {model: 'Events'}
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};