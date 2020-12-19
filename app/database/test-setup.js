const SequelizeConnection = require('../utils/sequelize-connection');
const TeacherModel = require('../models/teacher-model');
const StudentModel = require('../models/student-model');
const RegistrationModel = require('../models/registration-model');

const truncate = async () => {
  await SequelizeConnection.query('SET FOREIGN_KEY_CHECKS = 0');

  await SequelizeConnection.query('TRUNCATE TABLE teachers');
  await SequelizeConnection.query('TRUNCATE TABLE students');
  await SequelizeConnection.query('TRUNCATE TABLE registrations');

  await SequelizeConnection.query('SET FOREIGN_KEY_CHECKS = 1');
}

const seed = async () => {
  let teacher1 = await TeacherModel.create({ email: 'teacherken@gmail.com' });
  let teacher2 = await TeacherModel.create({ email: 'teacherjoe@gmail.com' });

  let student1 = await StudentModel.create({ email: 'student_only_under_teacher_ken@gmail.com' });
  let student2 = await StudentModel.create({ email: 'commonstudent1@gmail.com' });
  let student3 = await StudentModel.create({ email: 'commonstudent2@gmail.com' });

  await RegistrationModel.create({ teacher_id: teacher1.id, student_id: student1.id });
  await RegistrationModel.create({ teacher_id: teacher1.id, student_id: student2.id });
  await RegistrationModel.create({ teacher_id: teacher1.id, student_id: student3.id });
  await RegistrationModel.create({ teacher_id: teacher2.id, student_id: student2.id });
  await RegistrationModel.create({ teacher_id: teacher2.id, student_id: student3.id });
}

module.exports = {
  truncate: truncate,
  seed: seed
}
