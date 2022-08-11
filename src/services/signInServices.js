const { User } = require('../database/models');
const JWT = require('../helpers/JSONWebToken');
const status = require('../helpers/httpStatus');
const valid = require('../validations/SignIn');

const signIn = async (user) => {
  const validateLogin = valid.signIn(user);
  if (validateLogin.message) return validateLogin;

  const { email, password } = user;

  const findUser = await User.findOne({ where: { email } });
  const { dataValues } = findUser;

  if (password !== dataValues.password
    || email !== dataValues.email) {
      console.log(dataValues.email, email, dataValues.password, password);
    return { message: 'Invalid Fields', code: status.BAD_REQUEST };
  }

  const { password: _, ...noPasswordUSer } = dataValues;

  const token = JWT.createToken(noPasswordUSer);
  return { result: token, code: status.OK };
};

module.exports = {
  signIn,
};
