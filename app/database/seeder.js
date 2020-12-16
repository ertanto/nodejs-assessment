const sequelize = require('../utils/sequelize');
const Teacher = require('../models/teacher');
const Student = require('../models/student');

(async () => {
  let teacher1 = await Teacher.create({ email: 'test_teacher1@gmail.com' }); 
  let teacher2 = await Teacher.create({ email: 'test_teacher2@gmail.com' }); 
  let teacher3 = await Teacher.create({ email: 'test_teacher3@gmail.com' });

  Student.create({ email: 'test_student1@gmail.com', teacher_id: teacher1.id });
  Student.create({ email: 'test_student1@gmail.com', teacher_id: teacher2.id });
  Student.create({ email: 'test_student2@gmail.com', teacher_id: teacher2.id });
  Student.create({ email: 'test_student3@gmail.com', teacher_id: teacher2.id });
  Student.create({ email: 'test_student4@gmail.com', teacher_id: teacher3.id });
  Student.create({ email: 'test_student3@gmail.com', teacher_id: teacher3.id });
})();
