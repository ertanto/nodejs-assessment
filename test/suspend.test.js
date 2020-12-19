'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, before, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../app/server');
const testSetup = require('../app/database/test-setup');

describe('[Suspend API]', () => {
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

  it('Should be able to suspend specified student (commonstudent1@gmail.com) ', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/suspend',
      payload: {
        "student" : "commonstudent1@gmail.com"
      }
    });
    expect(res.statusCode).to.equal(204) && expect(res.result).to.equal(null);
  });

  it('Should return bad request if specified student is not available (not_a_registered_student@gmail.com) ', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/suspend',
      payload: {
        "student" : "not_a_registered_student@gmail.com"
      }
    });
    expect(res.statusCode).to.equal(400);
  });

  it('Should return bad request if specified student is not valid email (just_a_string) ', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/suspend',
      payload: {
        "student" : "just_a_string"
      }
    });
    expect(res.statusCode).to.equal(400);
  });


});
