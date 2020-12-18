'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, before, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../app/server');
const SequelizeConnection = require('../app/utils/sequelize-connection');

describe('[Register API]', () => {
  let server;
  
  before(async () => {
    await SequelizeConnection.query('SET FOREIGN_KEY_CHECKS = 0');
    await SequelizeConnection.query('TRUNCATE TABLE teachers');
    await SequelizeConnection.query('TRUNCATE TABLE students');
    await SequelizeConnection.query('TRUNCATE TABLE registrations');
    await SequelizeConnection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('*** test DB tables truncated *** \n');
  });

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('Should be able to register a student to a specified teacher', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: {
        "teacher": "teacherken@gmail.com",
        "students": [ "student_only_under_teacher_ken@gmail.com" ]
      }
    });
    expect(res.statusCode).to.equal(204);
  });

  it('Should be able to register multiple students to a teacher (teacherken@gmail.com)', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: {
        "teacher": "teacherken@gmail.com",
        "students": [ 
          "commonstudent1@gmail.com",
          "commonstudent2@gmail.com"
        ]
      }
    });
    expect(res.statusCode).to.equal(204);
  });

  it('Should be able to register multiple students to a teacher (teacherjoe@gmail.com)', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: {
        "teacher": "teacherjoe@gmail.com",
        "students": [ 
          "commonstudent1@gmail.com",
          "commonstudent2@gmail.com"
        ]
      }
    });
    expect(res.statusCode).to.equal(204);
  });

  it('Should return bad request if no payload supplied', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
    });
    expect(res.statusCode).to.equal(400);
  });

  it('Should return bad request if the payload is invalid JSON', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: "\"teacher\":\"test_teacher1@gmail.com\",\"students\":[\"test_student1@gmail.com\",\"test_student2@gmail.com\"]"
    });
    expect(res.statusCode).to.equal(400);
  });

  it('Should return bad request if the payload does not contain required properties (teacher, students)', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: "{\"shifu\":\"test_teacher1@gmail.com\",\"pupils\":[\"test_student1@gmail.com\",\"test_student2@gmail.com\"]}"
    });
    expect(res.statusCode).to.equal(400);
  });

  it('Should return bad request if the payload contains array of teachers', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: {
        "teacher": ["test_teacher1@gmail.com","test_teacher2@gmail.com"],
        "students":
          [
            "test_student1@gmail.com",
            "test_student2@gmail.com"
          ]
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  it('Should return bad request if teacher email is invalid (e.g. "teacherken.com")', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: {
        "teacher": "teacherken.com",
        "students": [ "test_student1@gmail.com" ]
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  it('Should return bad request if student email is invalid (e.g. "test_student1.com")', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: {
        "teacher": "teacherken@gmail.com",
        "students": [ "test_student1.com" ]
      }
    });
    expect(res.statusCode).to.equal(400);
  });

});
