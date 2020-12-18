'use strict';

const StudentRegistrationController = require('./controllers/student/registration');
const StudentRetrievalController = require('./controllers/student/retrieval');
const path = require('path');

module.exports = [
  {
		method:'POST',
		path: '/api/register',
		handler: StudentRegistrationController,
  },
  {
		method:'GET',
		path: '/api/commonstudents',
		handler: StudentRetrievalController,
	},
];
