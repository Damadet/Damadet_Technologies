const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUserCtrl,
  loginAdminCtrl,
  handleRefreshToken,
  logout,
  updateUser,
} = require('../controller/userCtrl');
const { authMiddleware } = require('../middlewares/authMiddleware');


router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.post('/admin-login', loginAdminCtrl);

router.get('/refresh', handleRefreshToken);
router.get('/logout', logout)

router.put('/update-user', authMiddleware, updateUser)

module.exports = router;
