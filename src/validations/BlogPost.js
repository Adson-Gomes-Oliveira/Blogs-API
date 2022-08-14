const JOI = require('joi');
const { Category } = require('../database/models');
const status = require('../helpers/httpStatus');

const MISSING_ERR_MESSAGE = 'Some required fields are missing';

const verifyCategoryIDs = async (categoryIds) => {
  const categorysFromDB = await Category.findAll();
  const arrayOfIDS = categorysFromDB.map((cat) => cat.dataValues.id);

  if (categoryIds === null || categoryIds === undefined) {
    return { message: '"categoryIds" not found', code: status.BAD_REQUEST };
  }

  const verifyCategoryArray = JOI.object({ categoryIds: JOI.array().min(1).required() });
  const categoryIdsValid = verifyCategoryArray.validate({ categoryIds });
  if (categoryIdsValid.error) {
    return { message: categoryIdsValid.error.message, code: status.BAD_REQUEST };
  }

  const categoryExist = [];
  categoryIds.forEach((id) => {
    categoryExist.push(arrayOfIDS.some((dbID) => dbID === id));
  });

  const isAllCategorysValid = categoryExist.every((bool) => bool === true);
  if (!isAllCategorysValid) return { message: '"categoryIds" not found', code: status.BAD_REQUEST };
  return {};
};

const create = async (payload) => {
  if (Object.values(payload).length < 1) {
    return { message: MISSING_ERR_MESSAGE, code: status.BAD_REQUEST };
  }

  const { title, content, categoryIds } = payload;
  const verifyTitle = JOI.object({ title: JOI.string().min(1).required() });
  const verifyContent = JOI.object({ content: JOI.string().min(1).required() });
  
  const titleValid = verifyTitle.validate({ title });
  const contentValid = verifyContent.validate({ content });
  const idsValid = await verifyCategoryIDs(categoryIds);
  
  if (titleValid.error) {
    return { message: MISSING_ERR_MESSAGE, code: status.BAD_REQUEST };
  }
  if (contentValid.error) {
    return { message: MISSING_ERR_MESSAGE, code: status.BAD_REQUEST };
  }
  if (idsValid.message) return idsValid;

  return {};
};

const edit = (payload) => {
  if (Object.values(payload).length < 1) {
    return { message: MISSING_ERR_MESSAGE, code: status.BAD_REQUEST };
  }
  
  const { title, content } = payload;
  const verifyTitle = JOI.object({ title: JOI.string().min(1).required() });
  const verifyContent = JOI.object({ content: JOI.string().min(1).required() });
  
  const titleValid = verifyTitle.validate({ title });
  const contentValid = verifyContent.validate({ content });
  
  if (titleValid.error) {
    return { message: MISSING_ERR_MESSAGE, code: status.BAD_REQUEST };
  }
  if (contentValid.error) {
    return { message: MISSING_ERR_MESSAGE, code: status.BAD_REQUEST };
  }

  return {};
};

module.exports = {
  create,
  edit,
};
