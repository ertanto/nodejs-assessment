const SequelizeConnection = require('../utils/sequelize-connection');
const TeacherModel = require('../models/teacher-model');
const StudentModel = require('../models/student-model');
const RegistrationModel = require('../models/registration-model');

(async () => {
  await SequelizeConnection.sync();
})();
