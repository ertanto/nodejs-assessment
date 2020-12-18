const SequelizeConnection = require('../utils/sequelize-connection');
const { DataTypes } = require("sequelize");
const TeacherModel = require("../models/teacher-model");
const StudentModel = require("../models/student-model");

var RegistrationModel = SequelizeConnection.define('registration', {
  teacher_id: {
    type: DataTypes.INTEGER,
    references: {
      model: TeacherModel,
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: StudentModel,
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  }
});

module.exports = RegistrationModel;
