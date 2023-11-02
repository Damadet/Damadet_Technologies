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
  getUserCart,
  emptyCart,
  applyCoupon,
  saveAddress,
  createOrder,
  getOrders,
  updateOrderStatus,
} = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.post('/admin-login', loginAdminCtrl);
router.post('/forgotpasswordtoken', forgotPasswordToken);
router.post('/cart', authMiddleware, userCart);
router.post('/cart/applycoupon', authMiddleware, applyCoupon);
router.put('/save-address', authMiddleware, saveAddress);
router.post('/cart/cash-order', authMiddleware, createOrder );

router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/getusers', authMiddleware, isAdmin, getallUsers);
router.get('/getusercart', authMiddleware, getUserCart);
router.get('/wishlist', authMiddleware, getWishlist);
router.get('/get-orders', authMiddleware, getOrders)
router.get('/:id', authMiddleware, isAdmin, getaUser);

router.put('/update-user', authMiddleware, updateUser);
router.put('/update-password', authMiddleware, updatePassword);
router.put('/block/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock/:id', authMiddleware, isAdmin, unblockUser);
router.put('/reset-password/:token', resetPassword);
router.put('/order/update-order/:id', authMiddleware, isAdmin, updateOrderStatus);

router.delete('/empty-cart', authMiddleware, emptyCart);
router.delete('/deleteauser/:id', authMiddleware, isAdmin, deleteaUser);

module.exports = router;
