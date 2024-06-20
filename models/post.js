'use strict';
const {
  Model
} = require('sequelize');
const formatDate = require('../Helpers/format');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: `UsersId` })
      Post.hasMany(models.PostTag, {foreignKey: `PostId`})
    }
    get formattedDate(){
      return formatDate(this.createdAt)
    }
  }
  Post.init({
    UsersId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};