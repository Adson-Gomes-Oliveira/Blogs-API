const signInServices = require('../services/signInServices');
const customError = require('../helpers/customError');

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const payload = {
      email,
      password: Number(password),
    };
    const token = await signInServices.signIn(payload);

    if (token.message) {
      const err = customError(token);
      throw err;
    }

    return res.status(token.code).json(token.result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signIn,
};
