const blogPostServices = require('../services/blogPostServices');
const customError = require('../helpers/customError');

const getAll = async (_req, res, next) => {
  try {
    const data = await blogPostServices.getAll();
    return res.status(data.code).json(data.result);
  } catch (error) {
    next(error);
  }
};
const getByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await blogPostServices.getByID(Number(id));

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
    const data = await blogPostServices.create(payload, req.user.id);
  
    if (data.message) {
      const err = customError(data);
      throw err;
    }
  
    return res.status(data.code).json(data.result);
  } catch (error) {
    next(error);
  }
};
const edit = async (req, res, next) => {
  try {
    const payload = req.body;
    const { id } = req.params;
    const data = await blogPostServices.edit(payload, id, req.user.id);
  
    if (data.message) {
      const err = customError(data);
      throw err;
    }
  
    return res.status(data.code).json(data.result);
  } catch (error) {
    next(error);
  }
};
const exclude = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await blogPostServices.exclude(Number(id), req.user.id);

    if (data.message) {
      const err = customError(data);
      throw err;
    }

    return res.status(data.code).end();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getAll,
  getByID,
  create,
  edit,
  exclude,
};
