const Sequelize = require('../utils/sequelize');
const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Allocation = require('../models/registration');

let options = {};
if (process.env.NODE_ENV==='test'){
  options = { force: true };
} 

(async () => {
  await Sequelize.sync(options);
})();
