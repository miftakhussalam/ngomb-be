'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    checkPassword = (password) => bcrypt.compareSync(password, this.password);

    generateToken = () => {
      const payload = {
        id: this.id,
        username: this.username,
        password: this.password,
      };

      const secretKey = process.env.ACCESS_TOKEN_SECRET;

      const access_token = jwt.sign(payload, secretKey, {
        expiresIn: '8h',
      });
      const refreshToken = jwt.sign({
        id: uuidv4(),
      }, process.env.REFRESH_TOKEN_SECRET);
      return { access_token, refreshToken };
    };

    static authenticate = async (body) => {
      try {
        const user = await this.findOne({
          where: {
            username: body.username,
          },
        });

        if (!user) {
          return Promise.reject(new Error('user not found!'));
        }

        const isPasswordValid = user.checkPassword(body.password);
        if (!isPasswordValid) {
          return Promise.reject(new Error('Wrong password'));
        }

        const token = await user.generateToken();

        const { password, ...noPassword } = user.dataValues;
        return Promise.resolve({ user: noPassword, token });
      } catch (err) {
        return Promise.reject(err);
      }
    };

    static authenticateToken = async (access_token) => {
      try {
        const decodedAccessToken = jwt
          .verify(access_token, process.env.ACCESS_TOKEN_SECRET);

        const user = await this.findOne({
          where: {
            username: decodedAccessToken.username,
          },
        });

        if (!user) {
          return Promise.reject(new Error('user not found!'));
        }

        const isPasswordValid = decodedAccessToken.password === user.password;
        if (!isPasswordValid) {
          return Promise.reject(new Error('Wrong password'));
        }

        const token = await user.generateToken();

        return Promise.resolve({ user, token });
      } catch (err) {
        return Promise.reject(err);
      }
    };

    static newToken = async (dataUser) => {
      try {
        const decodedRefreshToken = jwt
          .verify(dataUser.token.refreshToken, process.env.REFRESH_TOKEN_SECRET);

        console.log(decodedRefreshToken);
        const user = await this.findOne({
          where: {
            username: dataUser.user.username,
          },
        });
        const token = await user.generateToken();
        return Promise.resolve(token);
      } catch (error) {
        return Promise.reject(error);
      }
    };

    static associate(models) {
      // define association here
    }
  }
  User.init({
    fullname: DataTypes.STRING,
    username: DataTypes.STRING(50),
    email: DataTypes.STRING(100),
    password: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'customer'),
    phone: DataTypes.STRING(15),
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};