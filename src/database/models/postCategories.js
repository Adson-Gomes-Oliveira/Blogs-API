'use strict';

const PostCategories = (sequelize, DataTypes) => {
  const PostCategories = sequelize.define('PostCategories', {
    postId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
  }, {
    timestamps: false,
  });

  PostCategories.associate = (models) => {
    PostCategories.belongsToMany(models.BlogsPost, {
      as: 'posts',
      foreignKey: 'postId',
      through: PostCategories
    });
  };

  PostCategories.associate = (models) => {
    PostCategories.belongsToMany(models.Categories, {
      as: 'category',
      foreignKey: 'categoryId',
      through: PostCategories
    });
  };

  return PostCategories;
};

module.exports = PostCategories;
