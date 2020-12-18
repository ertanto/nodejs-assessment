const SequelizeConnection = require('../utils/sequelize-connection');
const { DataTypes } = require("sequelize");

var StudentModel = SequelizeConnection.define('student', {
  email: {
    type: DataTypes.STRING(75),
    unique: true,
    allowNull: false
  },
  suspended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
});

module.exports = StudentModel;
