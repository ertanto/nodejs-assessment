'use strict';
const Teacher = require('../models/teacher');
const Student = require('../models/student');

const Util = require('../utils/util');

module.exports = async (request, reply) => {
  let payload = Util.parseData(request.payload);  
  if (typeof payload.teacher==='undefined' || typeof payload.students==='undefined' ) return reply.response({ "message": "Invalid Parameter(s)" }).code(400);
  if (!Util.validEmail(payload.teacher) || !Util.validEmail(payload.students)) return reply.response({ "message": "There's invalid email(s) in the request body" }).code(400);
 
  let teacher = await Teacher.findOne({ where: { email: payload.teacher } });
  if (teacher===null){
    teacher = await Teacher.create({ email: payload.teacher });
  }

  for(let i=0; i<payload.students.length; i++){
    let student = await Student.findOne({ where: { email: payload.students[i], teacher_id: teacher.id } });
    if (student===null){
      student = await Student.create({ email: payload.students[i], teacher_id: teacher.id });
    }
  }
  return reply.response('').code(204);
};
