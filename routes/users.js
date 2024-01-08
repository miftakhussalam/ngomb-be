const express = require('express');
const {
  UserSignup,
  UserSignIn,
  GetAllUser,
  UpdateUser,
  UpdatePassword,
} = require('../controllers/user');
// const { authenticateJWT } = require('../controller/verifyToken');

const router = express.Router();

router.post('/signup', UserSignup);
router.post('/signin', UserSignIn);
router.get('/', GetAllUser);
router.put('/update', UpdateUser);
router.put('/updatePassword', UpdatePassword);

module.exports = router;
