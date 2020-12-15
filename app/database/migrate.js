const sequelize = require('../utils/sequelize');
const Teacher = require('../models/teacher');
const Student = require('../models/student');

Teacher.sync();
Student.sync();
