const categoryServices = require('../services/categoryServices');
const customError = require('../helpers/customError');

const getAll = async (req, res) => {
  const data = await categoryServices.getAll();
  res.status(data.code).json(data.result);
};
const create = async (req, res, next) => {
  try {
    const payload = req.body;
    const data = await categoryServices.create(payload);

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
  getAll,
  create,
};
