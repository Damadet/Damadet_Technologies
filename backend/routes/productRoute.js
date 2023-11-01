const {
  createProduct,
  getaproduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  addToWishlist,
  rating,
  uploadImages
} = require('../controller/productCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');

const router = require('express').Router();

router.post('/create-product', authMiddleware, isAdmin, createProduct);

router.get('/', authMiddleware, isAdmin, getAllProducts);
router.get('/:id', authMiddleware, isAdmin, getaproduct);

router.put('/rating', authMiddleware, rating);
router.put('/wishlist', authMiddleware, addToWishlist);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize , uploadImages );

router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router