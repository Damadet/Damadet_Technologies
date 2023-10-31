const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUserCtrl,
  loginAdminCtrl,
  handleRefreshToken,
  logout,
  updateUser,
  getaUser,
} = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.post('/admin-login', loginAdminCtrl);

router.get('/refresh', handleRefreshToken);
router.get('/logout', logout)
router.get('/:id',authMiddleware, isAdmin, getaUser)

router.put('/update-user', authMiddleware, updateUser)

module.exports = router;
