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
      type: Sequelize.INTEGER
    },
    firstName: {
      type: Sequelize.STRING(256),
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING(256),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(256),
      allowNull: false
    },
    username: {
      type: Sequelize.STRING(256),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING(256),
      allowNull: false
    },
    hashedPassword: {
      type: Sequelize.STRING.BINARY,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};