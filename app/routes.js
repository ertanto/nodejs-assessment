'use strict';

const registerController = require('./controllers/register');
const path = require('path');

module.exports = [
  {
		method:'POST',
		path: '/api/register',
		handler: registerController,
	},
];
