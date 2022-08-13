const Sequelize = require('sequelize');
const { BlogPost, PostCategory, User, Category } = require('../database/models');
const valid = require('../validations/BlogPost');
const config = require('../database/config/config');
const status = require('../helpers/httpStatus');

const sequelize = new Sequelize(config.development);

const getAll = async () => {
  const responseDetails = await BlogPost.findAll({
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories' },
    ],
  });
  return { result: responseDetails, code: status.OK };
};
const getByID = async (id) => {
  const responseDetails = await BlogPost.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories' },
    ],
  });

  if (responseDetails === null) return { message: 'Post does not exist', code: status.NO_CONTENT };
  return { result: responseDetails, code: status.OK };
};
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
const verifyUserToEdit = async (postID, userID) => {
  const getPostEdited = await BlogPost.findByPk(postID, {
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories' },
    ],
  });

  if (getPostEdited.dataValues.userId !== userID) {
    return { message: 'Unauthorized user', code: status.UNAUTHORIZED };
  }

  return { result: getPostEdited, code: status.OK };
};
const edit = async (payload, postID, userID) => {
  const validatePayload = valid.edit(payload);
  console.log(validatePayload);
  if (validatePayload.message) return validatePayload;
  
  const { title, content } = payload;
  try {
    const transaction = sequelize.transaction(async (t) => {
      await BlogPost.update(
        { title, content },
        { where: { id: postID, userId: userID } },
        { transaction: t },
      );
        
      const verifyUser = await verifyUserToEdit(postID, userID);
      return verifyUser;
    });
    
    return transaction;
  } catch (error) {
    return { result: error, code: status.INTERNAL };
  }
};
const exclude = async (postID, userID) => {
  const getPost = await BlogPost.findByPk(postID);
  if (getPost === null) {
    return { message: 'Post does not exist', code: status.NO_CONTENT };
  }

  const { dataValues } = getPost;

  if (dataValues.userId !== userID) {
    return { message: 'Unauthorized user', code: status.UNAUTHORIZED };
  }

  await BlogPost.destroy({ where: { id: postID }, force: true });
  console.log('OOOOOOOOOOIIIIIIIIIIII');
  return { result: null, code: status.DELETE };
};

module.exports = {
  getAll,
  getByID,
  create,
  edit,
  exclude,
};
