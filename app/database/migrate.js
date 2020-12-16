const sequelize = require('../utils/sequelize');
const Teacher = require('../models/teacher');
const Student = require('../models/student');

let options = {};
if (process.env.NODE_ENV==='test'){
  options = { force: true };
} 

(async () => {
  await sequelize.sync(options);
})();
