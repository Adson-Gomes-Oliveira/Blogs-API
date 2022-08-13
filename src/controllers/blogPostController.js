const blogPostServices = require('../services/blogPostServices');
const customError = require('../helpers/customError');

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

module.exports = {
  create,
};
