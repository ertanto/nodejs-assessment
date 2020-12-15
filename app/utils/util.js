'use strict';
const Joi = require('joi');

const schema = Joi.object({
  email: Joi.string().email()
});

const parseData = (data) => {
  if (!data) return {};
  if (typeof data === 'object') return data;
  if (typeof data === 'string') return JSON.parse(data);
  return {};
}

const validEmail = (data) => {
  let valid = true;
  if (typeof data =='object'){
    for(let i=0; i<data.length; i++ ){
      let { error, value } = schema.validate({ email: data[i] });
      if (typeof error!=='undefined'){
        valid = false;
      }
    }
  } else if (typeof data =='string'){
    let { error, value } = schema.validate({ email: data });
    if (typeof error!=='undefined'){
      valid = false;
    }
  }
  return valid;
}

module.exports = {
  parseData: parseData,
  validEmail: validEmail
};
