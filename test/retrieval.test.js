'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../app/server');

describe('[Retrieval API]', () => {
  let server;

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

});
