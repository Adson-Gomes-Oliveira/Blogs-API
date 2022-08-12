const Sequelize = require('sequelize');
const config = require('../database/config/config');
const { User } = require('../database/models');
const status = require('../helpers/httpStatus');
const valid = require('../validations/Users');
const JWT = require('../helpers/JSONWebToken');

const sequelize = new Sequelize(config.development);

const getAll = async () => {
  const data = await User.findAll();
  return { result: data, code: status.OK };
};

const create = async (payload) => {
  if (Object.keys(payload).length < 1) return { message: 'No Content', code: status.NO_CONTENT };

  const t = await sequelize.transaction();
  const { displayName, email, password, image } = payload;

  try {
    const token = JWT.createToken({ displayName, email, image });
    const findUser = await User.findOne({ where: { email } });
    const validatePayload = valid.create(payload, findUser);
    if (validatePayload.message) return validatePayload;

    await User.create(
      { displayName, email, password, image }, 
      { transaction: t },
    );
    await t.commit();

    return { result: token, code: status.CREATED };
  } catch (error) {
    await t.rollBack();
    return { message: error, code: status.INTERNAL };
  }
};

module.exports = {
  getAll,
  create,
};
