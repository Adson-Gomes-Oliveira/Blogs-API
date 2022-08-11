const { User } = require('../database/models');
const JWT = require('../helpers/JSONWebToken');
const status = require('../helpers/httpStatus');
const valid = require('../validations/SignIn');

const signIn = async (user) => {
  const validateLogin = valid.signIn(user);
  if (validateLogin.message) return validateLogin;

  const { email, password } = user;

  const findUser = await User.findOne({ where: { email } });

  if (findUser === null) return { message: 'Invalid fields', code: status.BAD_REQUEST };

  const { dataValues } = findUser;

  if (password !== dataValues.password
    || email !== dataValues.email) {
    return { message: 'Invalid fields', code: status.BAD_REQUEST };
  }

  const { password: _, ...noPasswordUSer } = dataValues;

  const token = JWT.createToken(noPasswordUSer);
  return { result: token, code: status.OK };
};

module.exports = {
  signIn,
};
