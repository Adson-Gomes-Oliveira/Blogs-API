const JWT = require('../helpers/JSONWebToken');
const customError = require('../helpers/customError');
const status = require('../helpers/httpStatus');

const tokenExist = (token) => {
  if (!token) {
    const err = customError({
      message: 'Token not found',
      code: status.UNAUTHORIZED,
    });
    throw err;
  }
};

const tokenIsValid = (token) => {
  const user = JWT.checkToken(token);
  if (user.message) {
    const err = customError({
      message: 'Expired or invalid token',
      code: status.UNAUTHORIZED,
    });
    throw err;
  }

  return user;
};

const auth = (req, _res, next) => {
  try {
    const { authorization } = req.headers;

    tokenExist(authorization);
    const user = tokenIsValid(authorization);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
