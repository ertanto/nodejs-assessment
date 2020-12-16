'use strict';
const sequelize = require('../utils/sequelize');
const Teacher = require('../models/teacher');
const Student = require('../models/student');

const Util = require('../utils/util');

module.exports = async (request, reply) => {
  let payload = Util.parseData(request.payload);  
  if (typeof payload.teacher==='undefined' || typeof payload.students==='undefined' ) return reply.response({ "message": "Invalid payload" }).code(400);
  if (!Util.validEmail(payload.teacher) || !Util.validEmail(payload.students)) return reply.response({ "message": "Invalid email in the payload" }).code(400);
 
  const t = await sequelize.transaction();
  try{
    let teacher = await Teacher.findOne({ where: { email: payload.teacher }, transaction: t });
    if (teacher===null){
      return reply.response({ "message": "Teacher not found" }).code(400);
    } else {
      for(let i=0; i<payload.students.length; i++){
        let student = await Student.findOne({ where: { email: payload.students[i], teacher_id: teacher.id }, transaction: t });
        if (student===null){
          student = await Student.create({ email: payload.students[i], teacher_id: teacher.id }, { transaction: t });
        }
      }
    }
    await t.commit();
  } catch (error) {
    await t.rollback();
    return reply.response({ "message": "Something went wrong" }).code(400);
  }
  
  return reply.response('').code(204);
};
