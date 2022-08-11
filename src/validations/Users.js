const JOI = require('joi');
const status = require('../helpers/httpStatus');

const errorObjects = {
  invalidName: { 
    message: 'displayName length must be at least 8 characters long',
    code: status.BAD_REQUEST,
  },
  invalidEmail: { 
    message: 'email must be a valid email',
    code: status.BAD_REQUEST,
  },
  invalidPassword: {
    message: 'password length must be at least 6 characters long',
    code: status.BAD_REQUEST,
  },
  userAlreadyExist: {
    message: 'User already registered',
    code: 409,
  },
};
const payloadRules = {
  verifyName: JOI.object({ displayName: JOI.string().min(8).required() }),
  verifyEmail: JOI.object({ email: JOI.string().email().required() }),
  verifyPassword: JOI.object({ password: JOI.string().min(6).required() }),
};

const create = (payload, findUser) => {
  const { displayName, email, password } = payload;

  const nameValid = payloadRules.verifyName.validate({ displayName });
  const emailValid = payloadRules.verifyEmail.validate({ email });
  const passwordValid = payloadRules.verifyPassword.validate({ password });

  if (nameValid.error) return errorObjects.invalidName;
  if (emailValid.error) return errorObjects.invalidEmail;
  if (passwordValid.error) return errorObjects.invalidPassword;
  if (findUser) return errorObjects.userAlreadyExist;

  return {};
};

module.exports = {
  create,
};
