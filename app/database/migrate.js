const SequelizeConnection = require('../utils/sequelize-connection');
const TeacherModel = require('../models/teacher-model');
const StudentModel = require('../models/student-model');
const RegistrationModel = require('../models/registration-model');

let options = {};
if (process.env.NODE_ENV==='test'){
  options = { force: true };
} 

(async () => {
  await SequelizeConnection.sync(options);
})();
