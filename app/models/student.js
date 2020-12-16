const sequelize = require('../utils/sequelize');
const { Model, DataTypes } = require("sequelize");
const Teacher = require('./teacher');

class Student extends Model {}
Student.init({
  email: {
    type: DataTypes.STRING(75),
    allowNull: false
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Teacher,
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  }
}, {
  sequelize,
  modelName: 'student'
});

module.exports = Student;
