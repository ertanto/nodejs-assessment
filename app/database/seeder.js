const TeacherModel = require('../models/teacher-model');
const StudentModel = require('../models/student-model');

(async () => {
  try{
    let teacher1 = await TeacherModel.create({ email: 'teacherken@gmail.com' });
    let teacher2 = await TeacherModel.create({ email: 'teacherjoe@gmail.com' });
  } catch (error){
    console.log(error);
  }
})();
