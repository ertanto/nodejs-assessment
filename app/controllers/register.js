'use strict';
const sequelize = require('../utils/sequelize');
const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Util = require('../utils/util');
const RequiredPayloadPropertyMissingException = require('../exceptions/RequiredPayloadPropertyMissingException');
const InvalidPayloadDataException = require('../exceptions/InvalidPayloadDataException');
const InvalidEmailException = require('../exceptions/InvalidEmailException');
const RecordNotFoundException = require('../exceptions/RecordNotFoundException');

const validatePayload = (payload) => {
  if (typeof payload.teacher==='undefined' || typeof payload.students==='undefined' ) throw new RequiredPayloadPropertyMissingException("Required payload property missing");
  if (typeof payload.teacher!=='string' || typeof payload.students!=='object') throw new InvalidPayloadDataException("Invalid payload data");
  if (!Util.validEmail(payload.teacher)) throw new InvalidEmailException("Invalid email in the payload data");
  for(let i=0; i<payload.students.length; i++ ){
    if (!Util.validEmail(payload.students[i])){
      throw new InvalidEmailException("Invalid email in the payload data");
    }
  }
}

module.exports = async (request, reply) => {
  try{
    const payload = Util.parseData(request.payload);  
    const t = await sequelize.transaction();
    validatePayload(payload);

    try{
      let teacher = await Teacher.findOne({ where: { email: payload.teacher }, transaction: t });
      if (teacher===null){
        throw new RecordNotFoundException('Unable to register student(s) to the specified teacher');
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
      if (error instanceof RecordNotFoundException){
        throw new RecordNotFoundException(error.message);
      }
      throw new Error("Something went wrong");
    }

  } catch(error){
    return reply.response({ 
      "statusCode": 400,
      "error": "Bad Request",
      "message": error.message 
    }).code(400);
  }
  
  return reply.response('').code(204);
};
