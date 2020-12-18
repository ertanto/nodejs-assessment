'use strict';

const StudentRegistrationController = require('./controllers/student/registration');
const StudentRetrievalController = require('./controllers/student/retrieval');
const StudentSuspendController = require('./controllers/student/suspend');

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
  {
		method:'POST',
		path: '/api/suspend',
		handler: StudentSuspendController,
	},
];
