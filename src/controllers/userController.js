const userServices = require('../services/userServices');
const customError = require('../helpers/customError');

const create = async (req, res, next) => {
  try {
    const payload = req.body;
    // const token = req.headers.authorization;
    const data = await userServices.create(payload);

    if (data.message) {
      const err = customError(data);
      throw err;
    }

    return res.status(data.code).json(data.result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
};
