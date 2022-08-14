const userServices = require('../services/userServices');
const customError = require('../helpers/customError');

const getAll = async (_req, res, next) => {
  try {
    const data = await userServices.getAll();

    if (data.message) {
      const err = customError(data);
      throw err;
    }

    return res.status(data.code).json(data.result);
  } catch (error) {
    next(error);
  }
};
const getByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await userServices.getByID(Number(id));
  
    if (data.message) {
      const err = customError(data);
      throw err;
    }
  
    return res.status(data.code).json(data.result);
  } catch (error) {
    next(error);
  }
};
const create = async (req, res, next) => {
  try {
    const payload = req.body;
    // const token = req.headers.authorization;
    const data = await userServices.create(payload);

    if (data.message) {
      const err = customError(data);
      throw err;
    }

    return res.status(data.code).json({ token: data.result });
  } catch (error) {
    next(error);
  }
};
const exclude = async (req, res, next) => {
  try {
    const data = await userServices.exclude(req.user.id);
    res.status(data.code).end();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getAll,
  getByID,
  create,
  exclude,
};
