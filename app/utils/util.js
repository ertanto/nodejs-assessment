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
  let { error, value } = schema.validate({ email: data });
    if (typeof error==='undefined'){
      return true;
    }
  return false;
}

module.exports = {
  parseData: parseData,
  validEmail: validEmail
};
