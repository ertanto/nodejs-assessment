'use strict';
const SequelizeConnection = require('../../utils/sequelize-connection');
const { QueryTypes } = require('sequelize');
const TeacherModel = require('../../models/teacher-model');
const Util = require('../../utils/util');
const RequiredParameterMissingException = require('../../exceptions/required-parameter-missing-exception');
const InvalidEmailException = require('../../exceptions/invalid-email-exception');
const RecordNotFoundException = require('../../exceptions/record-not-found-exception');


const validateQueryParam = async (queryParam) => {
  if (typeof queryParam.teacher==='undefined' || queryParam.teacher.length===0) throw new RequiredParameterMissingException("Required parameter missing");
  if (typeof queryParam.teacher==='string' && !Util.validEmail(queryParam.teacher)) throw new InvalidEmailException("Invalid email in the parameter");
  if (typeof queryParam.teacher==='object') {
    for(let i=0; i<queryParam.teacher.length; i++ ){
      if (!Util.validEmail(queryParam.teacher[i])){
        throw new InvalidEmailException("Invalid email in the parameter");
      }
    }
    for(let i=0; i<queryParam.teacher.length; i++ ){
      let teacher = await TeacherModel.findOne({ where: { email: queryParam.teacher[i] } })
      if (teacher===null) throw new RecordNotFoundException("Unable to find record of teacher(s) specified in the parameter");
    }
  }
}

module.exports = async (request, reply) => {
  let queryParam = request.query;
  let teacherID = [];
  let teacherModel;
  let students = [];
  
  try{
    await validateQueryParam(queryParam);
    if (typeof queryParam.teacher==='string') {
      teacherModel = await TeacherModel.findOne({ where: { email: queryParam.teacher } })
      if (teacherModel!==null) teacherID.push(teacherModel.id);
    }
    if (typeof queryParam.teacher==='object') {
      for(let i=0; i<queryParam.teacher.length; i++ ){
        teacherModel = await TeacherModel.findOne({ where: { email: queryParam.teacher[i] } })
        if (teacherModel!==null && teacherID.indexOf(teacherModel.id) == -1) teacherID.push(teacherModel.id);
      }
    }
    let results = await SequelizeConnection.query(
      `select s.email
      from students s 
      left join registrations r 
      on(s.id = r.student_id) 
      WHERE teacher_id IN (:teacher_id) and s.suspended = 0
      group by s.email
      having count(*) = :total
      order by email asc`,
      { 
        replacements: { 
          teacher_id: teacherID,
          total: teacherID.length
        }, 
        type: QueryTypes.SELECT
      }
    );
    for (let i=0; i<results.length; i++){
      students.push(results[i].email);
    }
    return reply.response({
      students: students
    }).code(200);
  } catch (error){
    return reply.response({ 
      "statusCode": 400,
      "error": "Bad Request",
      "message": error.message 
    }).code(400);
  }
};


