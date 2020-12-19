'use strict';
const SequelizeConnection = require('../../utils/sequelize-connection');
const { QueryTypes } = require('sequelize');
const TeacherModel = require('../../models/teacher-model');
const Util = require('../../utils/util');
const RequiredPayloadPropertyMissingException = require('../../exceptions/required-payload-property-missing-exception');
const InvalidPayloadDataException = require('../../exceptions/invalid-payload-data-exception');
const InvalidEmailException = require('../../exceptions/invalid-email-exception');
const RecordNotFoundException = require('../../exceptions/record-not-found-exception');
const StudentModel = require('../../models/student-model');
const regexPattern = /@([a-zA-Z0-9+._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

const validate = async (payload) => {
  if (typeof payload.teacher==='undefined' || typeof payload.notification==='undefined' ) throw new RequiredPayloadPropertyMissingException("Required payload property missing");
  if (typeof payload.teacher!=='string' || typeof payload.notification!=='string') throw new InvalidPayloadDataException("Invalid payload data");
  if (!Util.validEmail(payload.teacher)) throw new InvalidEmailException("Invalid email in the payload data");
  let teacher = await TeacherModel.findOne({ where: { email: payload.teacher } });
  if (teacher===null) throw new RecordNotFoundException('Teacher not found');
  let emails = payload.notification.match(regexPattern);
  if (emails!==null) {
    for (let i=0;i<emails.length; i++){
      let email = emails[i].substr(1);
      if (!Util.validEmail(email)) throw new InvalidEmailException("Invalid email in the payload data");
      let student = await StudentModel.findOne({ where: { email: email, suspended: 0 } });
      if (student===null) throw new RecordNotFoundException('The mentioned email is not an active student');
    }
  }
}

module.exports = async (request, reply) => {
  let recipients = [];
  try{
    const payload = Util.parseData(request.payload);
    await validate(payload);
    let teacher = await TeacherModel.findOne({ where: { email: payload.teacher } });
    let results = await SequelizeConnection.query(
      `select s.email
      from students s 
      left join registrations r 
      on(s.id = r.student_id) 
      WHERE teacher_id = :teacher_id and s.suspended = 0
      order by email asc`,
      { 
        replacements: { 
          teacher_id: teacher.id,
        }, 
        type: QueryTypes.SELECT
      }
    );
    for (let i=0; i<results.length; i++){
      recipients.push(results[i].email);
    }
    let emails = payload.notification.match(regexPattern);
    if (emails!==null) {
      for (let i=0;i<emails.length; i++){
        let email = emails[i].substr(1);
        if (recipients.indexOf(email) == -1) recipients.push(email);
      }
    }
    return reply.response({
      recipients: recipients
    }).code(200);
  } catch(error){
    return reply.response({ 
      "statusCode": 400,
      "error": "Bad Request",
      "message": error.message 
    }).code(400);
  }
  
  return reply.response('').code(204);
};
