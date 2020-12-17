'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../app/server');

describe('[Register API]', () => {
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
        "teacher": "test_teacher1@gmail.com",
        "students": [ "test_student1@gmail.com" ]
      }
    });
    console.log(res);
    expect(res.statusCode).to.equal(204);
  });

  it('Should be able to register multiple students to a specified teacher', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: {
        "teacher": "test_teacher1@gmail.com",
        "students":
          [
            "test_student1@gmail.com",
            "test_student2@gmail.com"
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

  it('Should return bad request if the teacher email is not in the system', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: {
        "teacher": "test_teacher999@gmail.com",
        "students": [ "test_student1@gmail.com" ]
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  it('Should return bad request if teacher email is invalid (e.g. "abc.def")', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: {
        "teacher": "abc.def",
        "students": [ "test_student1@gmail.com" ]
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  it('Should return bad request if student email is invalid (e.g. [ "test_student1@gmail.com", "abcdef" ])', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/register',
      payload: {
        "teacher": "test_teacher1@gmail.com",
        "students": [ "test_student1@gmail.com", "abcdef" ]
      }
    });
    expect(res.statusCode).to.equal(400);
  });

});
