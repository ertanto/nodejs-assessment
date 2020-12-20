'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, before, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../app/server');
const testSetup = require('../app/database/test-setup');

describe('[Retrieval API]', () => {
  let server;

  before(async () => {
    await testSetup.truncate();
    await testSetup.seed();
  });

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('Should return students under teacherken only, should return 3 students (commonstudent1, commonstudent2, student_only_under_teacher_ken)', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/api/commonstudents?teacher=teacherken@gmail.com'
    });
    expect(res.statusCode).to.equal(200) && expect(JSON.stringify(res.result)).to.equal('{"students":["commonstudent1@gmail.com","commonstudent2@gmail.com","student_only_under_teacher_ken@gmail.com"]}');
  });

  it('Should return students under teacherken & teacherjoe, should return 2 students (commonstudent1, commonstudent2)', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/api/commonstudents?teacher=teacherken@gmail.com&teacher=teacherjoe@gmail.com'
    });
    expect(res.statusCode).to.equal(200) && expect(JSON.stringify(res.result)).to.equal('{"students":["commonstudent1@gmail.com","commonstudent2@gmail.com"]}');    
  });

  it('Should return bad request if no parameter is supplied', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/api/commonstudents'
    });
    expect(res.statusCode).to.equal(400);
  });

  it('Should return bad request if the teacher parameter contains invalid email', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/api/commonstudents?teacher=teacherken.com'
    });
    expect(res.statusCode).to.equal(400);
  });

  it('Should return bad request if the teacher specified is not a valid teacher\'s email (not_valid_teacher@gmail.com)', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/api/commonstudents?teacher=not_valid_teacher@gmail.com'
    });
    expect(res.statusCode).to.equal(400);
  });

  it('Should return bad request if the teacher specified is not a valid teacher\'s email (not_valid_teacher@gmail.com)', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/api/commonstudents?teacher=teacherken@gmail.com&teacher=not_valid_teacher@gmail.com'
    });
    expect(res.statusCode).to.equal(400);
  });

});
