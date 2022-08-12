const JOI = require('joi');
const status = require('../helpers/httpStatus');

const create = (payload) => {
  if (Object.values(payload).length < 1) {
    return { message: '"name" is required', code: status.BAD_REQUEST };
  }

  const { name } = payload;
  const verifyName = JOI.object({ name: JOI.string().min(1).required() });
  const nameValid = verifyName.validate({ name });

  if (nameValid.error) return { message: nameValid.error.message, code: status.BAD_REQUEST };

  return {};
};

module.exports = {
  create,
};
