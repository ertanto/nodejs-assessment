'use strict';
const Sequelize = require('../utils/sequelize');
const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Util = require('../utils/util');
const RequiredParameterMissingException = require('../exceptions/required-parameter-missing-exception');
const InvalidEmailException = require('../exceptions/invalid-email-exception');
const RecordNotFoundException = require('../exceptions/record-not-found-exception');


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
      let teacher = await Teacher.findOne({ where: { email: queryParam.teacher[i] } })
      if (teacher===null) throw new RecordNotFoundException("Unable to find record of teacher(s) specified in the parameter");
    }
  }
}

const retrieve = async (request, reply) => {
  let queryParam = request.query;
  let arr = [];
  let where = {};
  let teacher;
  let students;
  try{
    await validateQueryParam(queryParam);
    if (typeof queryParam.teacher==='string') {
      teacher = await Teacher.findOne({ where: { email: queryParam.teacher } })
      if (teacher!==null) arr.push(teacher.id);
    }
    if (typeof queryParam.teacher==='object') {
      for(let i=0; i<queryParam.teacher.length; i++ ){
        teacher = await Teacher.findOne({ where: { email: queryParam.teacher[i] } })
        if (teacher!==null && arr.indexOf(teacher.id) == -1) arr.push(teacher.id);
      }
    }
    students = await Student.findAll({ attributes: ['email'], group: 'email', where: { teacher_id: arr } });
    for (let i=0; i<students.length; i++){
      let student = students[i];
      console.log(student.email);
    }
    console.log("All students:", JSON.stringify(students));
    return reply.response('').code(200);
  } catch (error){
    return reply.response({ 
      "statusCode": 400,
      "error": "Bad Request",
      "message": error.message 
    }).code(400);
  }
  

  // try{
  //   const payload = Util.parseData(request.payload);  
  //   const t = await Sequelize.transaction();
  //   validateQueryParam(payload);

  //   try{
  //     let teacher = await Teacher.findOne({ where: { email: payload.teacher }, transaction: t });
  //     if (teacher===null){
  //       throw new RecordNotFoundException('Unable to register student(s) to the specified teacher');
  //     } else {
  //       for(let i=0; i<payload.students.length; i++){
  //         let student = await Student.findOne({ where: { email: payload.students[i], teacher_id: teacher.id }, transaction: t });
  //         if (student===null){
  //           student = await Student.create({ email: payload.students[i], teacher_id: teacher.id }, { transaction: t });
  //         }
  //       }
  //     }
  //     await t.commit();
  //   } catch (error) {
  //     await t.rollback();
  //     if (error instanceof RecordNotFoundException){
  //       throw new RecordNotFoundException(error.message);
  //     }
  //     throw new Error("Something went wrong");
  //   }

  // } catch(error){
  //   return reply.response({ 
  //     "statusCode": 400,
  //     "error": "Bad Request",
  //     "message": error.message 
  //   }).code(400);
  // }
  
  //return reply.response('').code(204);
};

module.exports = {
  retrieve: retrieve
}
