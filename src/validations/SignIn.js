const JOI = require('joi');
const status = require('../helpers/httpStatus');

const signIn = (user) => {
  const verifyExist = JOI.object({ 
    email: JOI.string().email().required(),
    password: JOI.number().required(),
  });

  const existValidate = verifyExist.validate(user);
  if (existValidate.error) {
    return { message: 'Some required fields are missing', code: status.BAD_REQUEST };
  }

  return {};
};

module.exports = {
  signIn,
};
