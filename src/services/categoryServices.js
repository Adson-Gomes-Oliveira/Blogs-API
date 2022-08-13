const Sequelize = require('sequelize');
const { Category } = require('../database/models');
const valid = require('../validations/Category');
const config = require('../database/config/config');
const status = require('../helpers/httpStatus');

const sequelize = new Sequelize(config.development);

const getAll = async () => {
  const response = await Category.findAll();
  return { result: response, code: status.OK };
};
const create = async (payload) => {
  const validatePayload = valid.create(payload);
  if (validatePayload.message) return validatePayload;

  try {
  const transaction = await sequelize.transaction(async (t) => {
  const { name } = payload;
  
    const response = await Category.create(
      { name },
      { transaction: t },
    );
    console.log(response);

    return { result: response, code: status.CREATED };
  });

  return transaction;
  } catch (error) {
    return { message: error, code: status.INTERNAL };
  }
};

module.exports = {
  getAll,
  create,
};