const signInServices = require('../services/signInServices');
const customError = require('../helpers/customError');

const signIn = async (req, res, next) => {
  try {
    const payload = req.body;
    const token = await signInServices.signIn(payload);

    if (token.message) {
      const err = customError(token);
      throw err;
    }

    return res.status(token.code).json({ token: token.result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signIn,
};
