const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { User } = require('../models');
require('dotenv').config();

const GetAccessToken = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userLogin = await User.authenticate({ username, password });
    // console.log(userLogin);
    const { token } = userLogin;

    res.status(200).json({
      access_token: token.access_token,
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

const UpdateToken = async (req, res) => {
  const { user, token } = req.body;
  try {
    const newToken = await User.newToken({ user, token });
    res.status(200).json({
      data: newToken,
      message: 'new token',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
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

const SignInWithToken = async (req, res) => {
  const { access_token } = req.body;
  try {
    const userLogin = await User.authenticateToken(access_token);
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

const ForgotPassword = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST_EMAIL,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_EMAIL,
      },
    });
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    const token = user.generateToken();
    console.log(token);
    // function to generate a password reset token
    // const token = generateToken();
    // Save the token to the database associated with the email

    // Send email to the user with the reset password link
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset',
      html: `<p>Please click on the link below to reset your password:</p>
            <p><a href="${process.env.IP_FRONTEND}/reset-password/?resetToken=${token.access_token}">Reset Password</a></p>`,
    };

    await transporter.sendMail(mailOptions);
    // console.log(data);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const ResetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    const decodeToken = jwt.decode(resetToken);
    console.log(decodeToken);
    const userExist = await User.findOne({
      where: {
        username: decodeToken.username,
        password: decodeToken.password,
      },
    });
    if (!userExist) {
      return res.status(400).json({
        status: 'fail',
        message: 'User not found',
        data: null,
      });
    }
    const isUpdate = await User.update(
      {
        password: bcrypt.hashSync(newPassword, 8),
      },
      {
        where: {
          username: decodeToken.username,
          password: decodeToken.password,
        },
      },
    );

    if (isUpdate < 1) {
      return res.status(400).json({
        status: 'fail',
        message: 'Password not updated',
        data: null,
      });
    }

    const userUpdated = await User.findOne({
      where: {
        username: decodeToken.username,
        // password: bcrypt.hashSync(newPassword, 8),
        // password: decodeToken.password,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'password updated',
      data: userUpdated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  UpdateToken,
  GetAccessToken,
  UserSignIn,
  SignInWithToken,
  ForgotPassword,
  ResetPassword,
};
