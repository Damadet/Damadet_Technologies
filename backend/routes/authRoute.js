const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUserCtrl,
  loginAdminCtrl,
  handleRefreshToken,
  logout,
} = require('../controller/userCtrl');


router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.post('/admin-login', loginAdminCtrl);

router.get('/refresh', handleRefreshToken);
router.get('/logout', logout)

module.exports = router;
