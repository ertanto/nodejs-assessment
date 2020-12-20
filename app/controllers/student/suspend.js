'use strict';
const StudentModel = require('../../models/student-model');
const Util = require('../../utils/util');
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
    await validate(payload);
    let [updatedRecord] = await StudentModel.update({ suspended: 1 },{ where: { email: payload.student }});
    if (updatedRecord==0) throw new RecordNotFoundException('Unable to suspend student, ' + payload.student + ' is not a valid active student');
    return reply.response('').code(204);
  } catch (error){
    return reply.response({ 
      "statusCode": 400,
      "error": "Bad Request",
      "message": error.message 
    }).code(400);
  }
}

