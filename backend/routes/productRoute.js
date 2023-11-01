const {
  createProduct,
  getaproduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  addToWishlist
} = require('../controller/productCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.post('/create-product', authMiddleware, isAdmin, createProduct);

router.get('/', authMiddleware, isAdmin, getAllProducts);
router.get('/:id', authMiddleware, isAdmin, getaproduct);

router.put('/wishlist', authMiddleware, addToWishlist);
router.put('/:id', authMiddleware, isAdmin, updateProduct);

router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router