'use strict';
const SequelizeConnection = require('../../utils/sequelize-connection');
const StudentModel = require('../../models/student-model');
const Util = require('../../utils/util');
const RequiredParameterMissingException = require('../../exceptions/required-parameter-missing-exception');
const InvalidEmailException = require('../../exceptions/invalid-email-exception');
const RecordNotFoundException = require('../../exceptions/record-not-found-exception');

const validate = async (payload) => {
  if (typeof payload.student==='undefined' ) throw new RequiredPayloadPropertyMissingException("Required payload property missing");
  if (typeof payload.student!=='string') throw new InvalidPayloadDataException("Invalid payload data");
  if (!Util.validEmail(payload.student)) throw new InvalidEmailException("Invalid email in the payload data");
}

module.exports = async (request, reply) => {
  const payload = Util.parseData(request.payload);  
  try{
    validate(payload);
    let [updatedRecord] = await StudentModel.update({ suspended: 1 },{ where: { email: payload.student }});
    if (updatedRecord==0) throw RecordNotFoundException('Unable to suspend student, student not found');
    return reply.response('').code(204);
  } catch (error){
    console.log(error);
    return reply.response({ 
      "statusCode": 400,
      "error": "Bad Request",
      "message": error.message 
    }).code(400);
  }
}

