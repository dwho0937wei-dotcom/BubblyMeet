'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstName: {
      type: DataTypes.STRING(256)
    },
    lastName: {
      type: DataTypes.STRING(256)
    },
    email: {
      type: DataTypes.STRING(256)
    },
    username: {
      type: DataTypes.STRING(256)
    },
    password: {
      type: DataTypese.STRING(256)
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};