const Sequelize = require('sequelize');
const { BlogPost, PostCategory } = require('../database/models');
const valid = require('../validations/BlogPost');
const config = require('../database/config/config');
const status = require('../helpers/httpStatus');

const sequelize = new Sequelize(config.development);

const formatResponseObject = (response) => ({
  ...response.dataValues,
  published: new Date(),
  updated: new Date(),
});
const createPostCategory = async (postID, categoryIds, t) => {
  const promises = [];

  categoryIds.forEach((id) => {
      promises.push(PostCategory.create(
        { postId: postID, categoryId: id },
        { transaction: t },
      ));
  });

  await Promise.all(promises);
};
const create = async (payload, userID) => {
  const validatePayload = await valid.create(payload);
  if (validatePayload.message) return validatePayload;

  const { title, content, categoryIds } = payload;

  try {
    const transaction = await sequelize.transaction(async (t) => {
      const response = await BlogPost.create(
        { title, content, userId: userID },
        { transaction: t },
      );
      await createPostCategory(response.id, categoryIds, t);
      const createdPost = formatResponseObject(response);
      return { result: createdPost, code: status.CREATED };
    });

    return transaction;
  } catch (error) {
    return { message: error.message, code: status.INTERNAL };    
  }
};

module.exports = {
  create,
};
