const sequelize = require('../utils/sequelize');
const { Model, DataTypes } = require("sequelize");
const Teacher = require('./teacher');

class Student extends Model {}
Student.init({
  email: {
    type: DataTypes.STRING(75),
    allowNull: false
  },
  suspended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'student'
});

module.exports = Student;
