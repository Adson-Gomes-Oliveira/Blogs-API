const JWT = require('jsonwebtoken');
const status = require('./httpStatus');
require('dotenv').config();

const createToken = (user) => {
  const token = JWT.sign({ data: user }, process.env.JWT_SECRET, {
    expiresIn: '1h',
    algorithm: 'HS256',
  });

  return token;
};

const checkToken = (token) => {
  try {
    const { data } = JWT.verify(token, process.env.JWT_SECRET);
    return data;
  } catch (error) {
    return {
      message: 'Unauthorized, invalid token!',
      code: status.UNAUTHORIZED,
    };
  }
};

module.exports = {
  createToken,
  checkToken,
};
