'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, before, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../app/server');
const testSetup = require('../app/database/test-setup');
const TeacherModel = require('../app/models/teacher-model');
const StudentModel = require('../app/models/student-model');
const RegistrationModel = require('../app/models/registration-model');

describe('[Notification API]', () => {
  let server;

  before(async () => {
    await testSetup.truncate();
    let teacher1 = await TeacherModel.create({ email: 'teacherken@gmail.com'});
    let teacher2 = await TeacherModel.create({ email: 'teacherX@gmail.com'});
    
    let student1 = await StudentModel.create({ email: 'studentbob@gmail.com'});
    let student2 = await StudentModel.create({ email: 'student_suspended@gmail.com', suspended:1 });
    let student3 = await StudentModel.create({ email: 'studentagnes@gmail.com' });
    let student4 = await StudentModel.create({ email: 'studentmiche@gmail.com' });

    await RegistrationModel.create({ teacher_id: teacher1.id, student_id: student1.id });
    await RegistrationModel.create({ teacher_id: teacher1.id, student_id: student2.id });
    await RegistrationModel.create({ teacher_id: teacher2.id, student_id: student3.id });
    await RegistrationModel.create({ teacher_id: teacher2.id, student_id: student4.id });
  });

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('Should return students under teacher teacherken@gmail.com and also the mentioned students in notification', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/retrievefornotifications',
      payload: {
        "teacher":  "teacherken@gmail.com",
        "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
      }
    });
    expect(res.statusCode).to.equal(200) && expect(JSON.stringify(res.result)).to.equal('{"recipients":["studentbob@gmail.com","studentagnes@gmail.com","studentmiche@gmail.com"]}');
  });

  it('Should return students under teacherken@gmail.com and not suspended', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/retrievefornotifications',
      payload: {
        "teacher":  "teacherken@gmail.com",
        "notification": "Hey everybody"
      }
    });
    expect(res.statusCode).to.equal(200) && expect(JSON.stringify(res.result)).to.equal('{"recipients":["studentbob@gmail.com"]}');
  });

  it('Should return bad request if mentioned student is suspended', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/retrievefornotifications',
      payload: {
        "teacher":  "teacherken@gmail.com",
        "notification": "Hey you @student_suspended@gmail.com"
      }
    });
    expect(res.statusCode).to.equal(400) ;
  });

  it('Should return bad request if mentioned student not a student', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/retrievefornotifications',
      payload: {
        "teacher":  "teacherken@gmail.com",
        "notification": "Hey you @not_student_email@gmail.com"
      }
    });
    expect(res.statusCode).to.equal(400) ;
  });

});
