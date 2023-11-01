const { createProduct } = require('../controller/productCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.post('/create-product', authMiddleware, isAdmin, createProduct);

module.exports = router