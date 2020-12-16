const sequelize = require('../utils/sequelize');
const { Model, DataTypes } = require("sequelize");

class Teacher extends Model {}
Teacher.init({
  email: {
    type: DataTypes.STRING(75),
    unique: true,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'teacher'
});

module.exports = Teacher;
