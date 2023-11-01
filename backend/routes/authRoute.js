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
  getallUsers,
  deleteaUser,
  blockUser,
  unblockUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  getWishlist,
  userCart,
} = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.post('/admin-login', loginAdminCtrl);
router.post('/forgotpasswordtoken', forgotPasswordToken);
router.post('/cart', authMiddleware, userCart);

router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/getusers', authMiddleware, isAdmin, getallUsers);
router.get('/wishlist',authMiddleware, getWishlist);
router.get('/:id',authMiddleware, isAdmin, getaUser);

router.put('/update-user', authMiddleware, updateUser);
router.put('/update-password', authMiddleware, updatePassword);
router.put('/block/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock/:id', authMiddleware, isAdmin, unblockUser);
router.put('/reset-password/:token', resetPassword);

router.delete('/deleteauser/:id', authMiddleware, isAdmin, deleteaUser);

module.exports = router;
