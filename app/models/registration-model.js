const SequelizeConnection = require('../utils/sequelize-connection');
const { DataTypes } = require("sequelize");

var RegistrationModel = SequelizeConnection.define('registration', {
  teacher_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Teacher,
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  }
});

module.exports = RegistrationModel;
