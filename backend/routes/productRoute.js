const { createProduct, getaproduct, getAllProducts } = require('../controller/productCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.post('/create-product', authMiddleware, isAdmin, createProduct);

router.get('/', authMiddleware, isAdmin, getAllProducts);
router.get('/:id', authMiddleware, isAdmin, getaproduct);

module.exports = router