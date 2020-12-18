'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../app/server');

describe('[Suspend API]', () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('Should be able to suspend specified student (studentmary@gmail.com) ', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/api/suspend',
      payload: {
        "student" : "studentmary@gmail.com"
      }
    });
    expect(res.statusCode).to.equal(204) && expect(res.result).to.equal(null);
  });

});
