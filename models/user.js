'use strict';
var bcrypt = require('bcryptjs');

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: `id` })
      User.hasOne(models.Profile, { foreignKey: 'UsersId' });
    }

    static async getUserInstance(value){
      return await User.findOne({ where: { username: value } });
    }

  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      validate: {
        isAdminOrUser(value) {
          if (value !== 'admin' && value !== 'user') {
            throw new Error('Choose between "admin" or "user"');
          }
        }
      }}
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: user => {
        var salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
        
      }
    }
  });
  return User;
};