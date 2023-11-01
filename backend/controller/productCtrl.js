const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const User = require('../models/userModel')
const slugify = require('slugify');
const { validateMongoDbId } = require('../utils/validateMongoDbid');


// Create a product

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

// Get a product

const getaproduct = asyncHandler(async(req, res) => {
  const { id } = req.params;
  try{
    const product = await Product.findById(id);
    res.json(product);
  } catch (err) {
    throw new Error(err);
  }
});

// Get all products

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    throw new Error(error)
  }
});

// delete product

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const deletedProduct = await Product.findByIdAndDelete({ _id: id }, req.body, {
      new: true,
    });
    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { 
  createProduct,
  getaproduct,
  getAllProducts,
  deleteProduct
}