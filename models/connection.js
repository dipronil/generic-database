'use strict';
const {
  Model
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class Connection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Connection.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    projectId: DataTypes.STRING,
    organizationId: DataTypes.STRING,
    host: DataTypes.STRING,
    userName: DataTypes.STRING,
    port: DataTypes.STRING,
    dialect: DataTypes.STRING,
    password: DataTypes.STRING,
    database: DataTypes.STRING,
    url: DataTypes.STRING,
    rootUser: DataTypes.STRING,
    rootPassword: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Connection',
  });
  Connection.beforeCreate((connection) => {
    const newId = uuidv4();
    connection.setDataValue('id', newId);
  });
  return Connection;
};