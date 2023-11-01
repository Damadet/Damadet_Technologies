const asyncHandler = require('express-async-handler');
const fs = require('fs');
const Product = require('../models/productModel');
const User = require('../models/userModel')
const slugify = require('slugify');
const { validateMongoDbId } = require('../utils/validateMongoDbid');
const cloudinaryUploadImg = require('../utils/cloudinary');


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

// update product

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// add to wishlist

const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);

    if (alreadyadded) {
      const user = await User.findByIdAndUpdate(_id, {
        $pull: { wishlist: prodId },
      }, {
        new: true,
      });
      res.json(user);
    } else {
      const user = await User.findByIdAndUpdate(_id, {
        $push: { wishlist: prodId },
      }, {
        new: true,
      });
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// product rating

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    const alreadyRated = product.ratings
      .find((userId) => userId.postedby.toString() === _id.toString());
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { 'ratings.$.star': star, 'ratings.$.comment': comment },
        },
        {
          new: true,
        },
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(prodId, {
        $push: {
          ratings: {
            star,
            comment,
            postedby: _id,
          },
        },
      }, {
        new: true,
      });
    }
    const getallratings = await Product.findById(prodId);
    const totalRating = getallratings.ratings.length;
    const ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    const actualRating = Math.round(ratingsum / totalRating);
    const finalRating = await Product.findByIdAndUpdate(prodId, {
      totalrating: actualRating,
    }, {
      new: true,
    });
    res.json(finalRating);
  } catch (error) {
    throw new Error(error);
  }
});

// upload pictures

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, 'images');
    const urls = [];
    const { files } = req;
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      const { path } = file;
      // eslint-disable-next-line no-await-in-loop
      const newpath = await uploader(path);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => file),
      },
      {
        new: true,
      },
    );
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { 
  createProduct,
  getaproduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  addToWishlist,
  rating,
  uploadImages
}