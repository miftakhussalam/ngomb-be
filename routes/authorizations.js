const express = require('express');
const {
  GetAccessToken,
  UpdateToken,
  SignInWithToken,
  UserSignIn,
  ForgotPassword,
  ResetPassword,
} = require('../controllers/authorization');

const router = express.Router();

router.post('/accessToken', GetAccessToken);
router.post('/updateToken', UpdateToken);
router.post('/signin', UserSignIn);
router.post('/signWithToken', SignInWithToken);
router.post('/forgotPassword', ForgotPassword);
router.post('/resetPassword', ResetPassword);

module.exports = router;

