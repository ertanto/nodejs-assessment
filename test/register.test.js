'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../app/server');

describe('Register API', () => {
  let server;

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
        "teacher": "teacher_test1@gmail.com",
        "students": [ "student_test1@gmail.com" ]
      }
    });
    expect(res.statusCode).to.equal(204);
  });

  it('Should be able to register multiple students to a specified teacher', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: {
        "teacher": "teacher_test2@gmail.com",
        "students":
          [
            "student_test2a@gmail.com",
            "student_test2b@gmail.com"
          ]
      }
    });
    expect(res.statusCode).to.equal(204);
  });

  it('Should return bad request if the payload is invalid JSON', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: "\"teacher\":\"teacher_test2@gmail.com\",\"students\":[\"student_test2a@gmail.com\",\"student_test2b@gmail.com\"]"
    });
    expect(res.statusCode).to.equal(400);
  });

  it('Should return bad request if the payload does not contain required parameters (teacher, students)', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: "{\"shifu\":\"teacher_test1@gmail.com\",\"pupils\":[\"studentjon@gmail.com\",\"studenthon@gmail.com\"]}"
    });
    expect(res.statusCode).to.equal(400);
  });

  it('Should return bad request if the email is invalid (teacher: "abc.def")', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: {
        "teacher": "abc.def",
        "students": [ "student_test1@gmail.com" ]
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  it('Should return bad request if the email is invalid (student: [ "abcdef" ])', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: {
        "teacher": "teacher_test1@gmail.com",
        "students": [ "abcdef" ]
      }
    });
    expect(res.statusCode).to.equal(400);
  });

});
