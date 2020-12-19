'use strict';

const StudentRegistrationController = require('./controllers/student/registration');
const StudentRetrievalController = require('./controllers/student/retrieval');
const StudentSuspendController = require('./controllers/student/suspend');
const StudentNotificationController = require('./controllers/student/notification');

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
  {
		method:'POST',
		path: '/api/retrievefornotifications',
		handler: StudentNotificationController,
	},
];
