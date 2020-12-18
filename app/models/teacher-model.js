const SequelizeConnection = require('../utils/sequelize-connection');
const { DataTypes } = require("sequelize");

var TeacherModel = SequelizeConnection.define('teacher', {
  email: {
    type: DataTypes.STRING(75),
    unique: true,
    allowNull: false
  }
})

module.exports = TeacherModel;
