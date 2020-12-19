'use strict';
const TeacherModel = require('../../models/teacher-model');
const StudentModel = require('../../models/student-model');
const RegistrationModel = require('../../models/registration-model');
const Util = require('../../utils/util');
const RequiredPayloadPropertyMissingException = require('../../exceptions/required-payload-property-missing-exception');
const InvalidPayloadDataException = require('../../exceptions/invalid-payload-data-exception');
const InvalidEmailException = require('../../exceptions/invalid-email-exception');

const validate = async (payload) => {
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
    await validate(payload);

    try{
      let teacher = await TeacherModel.findOne({ where: { email: payload.teacher } });
      if (teacher===null){
        teacher = await TeacherModel.create({ email: payload.teacher } );
      }
      for(let i=0; i<payload.students.length; i++){
        let student = await StudentModel.findOne({ where: { email: payload.students[i] } });
        if (student===null){
          student = await StudentModel.create({ email: payload.students[i] } );
        }

        let registrationModel = await RegistrationModel.findOne({ where: { teacher_id: teacher.id, student_id: student.id } });
        if (registrationModel===null){
          await RegistrationModel.create({ teacher_id: teacher.id, student_id: student.id });
        }
      }
    } catch (error) {
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
