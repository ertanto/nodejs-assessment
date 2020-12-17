const sequelize = require('../utils/sequelize');
const { Model, DataTypes } = require("sequelize");
const Teacher = require('./teacher');
const Student = require('./student');

class Registration extends Model {}
Registration.init({
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
}, {
  sequelize,
  modelName: 'allocation'
});

module.exports = Registration;
