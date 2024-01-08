const bcrypt = require('bcrypt');
const Validator = require('fastest-validator');
const { Op } = require('sequelize');
const { User } = require('../models');

const validator = new Validator();

const UserSignup = async (req, res) => {
  const {
    fullname,
    username,
    email,
    password,
    role = 'customer',
    phone,
    address,
  } = req.body;

  const userScheme = {
    fullname: { type: 'string', empty: false },
    username: { type: 'string', empty: false },
    email: { type: 'string' },
    password: { type: 'string', empty: false },
    role: { type: 'string' },
    phone: { type: 'string' },
    address: { type: 'string' },
  };

  try {
    const bodyParsed = {
      fullname,
      username,
      email,
      password,
      role,
      phone,
      address,
    };

    const validationMessagee = validator.validate(bodyParsed, userScheme);

    if (validationMessagee.length) {
      return res.status(401).json({
        status: 'fail',
        message: validationMessagee,
        data: null,
      });
    }

    const usernameExist = await User.findOne({
      where: { username },
    });
    if (usernameExist) {
      return res.status(404).json({
        status: 'fail',
        message: 'Username has been used',
        data: null,
      });
    }
    if (!username || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please fill all the fields',
        data: null,
      });
    }
    if (!usernameExist && username && password) {
      const newUser = await User.create({
        fullname,
        username,
        email,
        password: bcrypt.hashSync(password, 8),
        role,
        phone,
        address
      });
      return res.status(201).json({
        status: 'success',
        message: 'user created successfully',
        data: newUser,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

const UserSignIn = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userLogin = await User.authenticate({ username, password });
    // console.log(userLogin);
    res.status(200).json({
      data: userLogin,
      message: 'Login successfull',
    });
  } catch (error) {
    if (error?.message === 'user not found' || error?.message === 'wrong password!') {
      return res.status(404).json({
        status: 'fail',
        message: error.message,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const UpdateUser = async (req, res) => {
  const {
    id,
    fullname,
    username,
    email,
    role,
    phone,
    address
  } = req.body;

  const userScheme = {
    id: { type: 'number', positive: true, integer: true },
    fullname: { type: 'string', empty: false },
    username: { type: 'string', empty: false },
    email: { type: 'string', empty: false },
    role: { type: 'string', empty: false },
    phone: { type: 'string', empty: false },
    address: { type: 'string', empty: false },
  };

  try {
    const bodyParsed = {
      id,
      fullname,
      username,
      email,
      role,
      phone,
      address,
    };

    const validationMessagee = validator.validate(bodyParsed, userScheme);

    if (validationMessagee.length) {
      return res.status(400).json({
        status: 'fail',
        message: validationMessagee,
        data: null,
      });
    }

    const usernameExist = await User.findOne({
      where: {
        [Op.and]: [
          { username },
          {
            [Op.not]: [
              { id },
            ],
          },
        ],
      },
    });

    if (usernameExist) {
      return res.status(400).json({
        status: 'fail',
        message: 'User with the same username has been exist',
        data: null,
      });
    }

    const emailExist = await User.findOne({
      where: {
        [Op.and]: [
          { email },
          {
            [Op.not]: [
              { id },
            ],
          },
        ],
      },
    });

    if (emailExist) {
      return res.status(400).json({
        status: 'fail',
        message: 'User with the same email has been exist',
        data: null,
      });
    }

    const isUpdate = await User.update(bodyParsed, { where: { id } });

    if (isUpdate < 1) {
      return res.status(400).json({
        status: 'fail',
        message: 'User not updated',
        data: null,
      });
    }

    const userUpdated = await User.findOne({ where: { id }, attributes: { exclude: ['password'] } });

    return res.status(200).json({
      status: 'success',
      message: 'User updated',
      data: userUpdated,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const UpdatePassword = async (req, res) => {
  const {
    id,
    newPassword,
    oldPassword,
  } = req.body;

  const userScheme = {
    id: { type: 'number', positive: true, empty: false },
    newPassword: { type: 'string', empty: false },
    oldPassword: { type: 'string', empty: false },
  };

  try {
    const bodyParsed = {
      id,
      newPassword,
      oldPassword,
    };
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Compare the old password with the one in the database
    const isMatch = await bcrypt.compareSync(oldPassword, user.dataValues.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    const validationMessagee = validator.validate(bodyParsed, userScheme);

    if (validationMessagee.length) {
      return res.status(400).json({
        status: 'fail',
        message: validationMessagee,
        data: null,
      });
    }

    const isUpdate = await User.update(
      {
        password: bcrypt.hashSync(newPassword, 8),
      },
      {
        where: { id },
      },
    );

    if (isUpdate < 1) {
      return res.status(400).json({
        status: 'fail',
        message: 'Password not updated',
        data: null,
      });
    }

    const userUpdated = await User.findOne({ where: { id }, attributes: { exclude: ['password'] } });

    return res.status(200).json({
      status: 'success',
      message: 'User updated',
      data: userUpdated,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const GetAllUser = async (req, res) => {
  try {
    const users = await User.findAll({
      order: ['fullname'],
      attributes: { exclude: ['password'] },
    });
    return res.status(200).json({
      status: 'success',
      message: users.length > 0 ? 'User Found' : 'User is empty',
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const GetUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const users = await User.findOne({
      where: { username },
      attributes: { exclude: ['password'] },
    });
    return res.status(200).json({
      status: 'success',
      message: users.length > 0 ? 'User Found' : 'User is empty',
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = {
  UserSignup,
  UserSignIn,
  UpdateUser,
  UpdatePassword,
  GetAllUser,
  GetUserByUsername,
};

