'use strict';

const RegisterController = require('./controllers/register-controller');
const StudentController = require('./controllers/student-controller');
const path = require('path');

module.exports = [
  {
		method:'POST',
		path: '/api/register',
		handler: RegisterController,
  },
  {
		method:'GET',
		path: '/api/commonstudents',
		handler: StudentController.retrieve,
	},
];
