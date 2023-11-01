const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const User = require('../models/userModel')
const slugify = require('slugify');
const { validateMongoDbId } = require('../utils/validateMongoDbid');

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createProduct }