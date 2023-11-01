const Category = require("../models/prodcategoryModel.js");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbid.js");

const createCategory = asyncHandler(async (req, res) => { 
    try {
        const newCategory = await Category.create(req.body)
        res.json(newCategory);
    } catch (error) {
        throw new Error(error)
    }
})


// update category

const updateCategory = asyncHandler(async (req, res) => { 
    const id = req.params.id
    validateMongoDbId(id)
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true})
        updatedCategory.save()
        res.json(updatedCategory);
    } catch (error) {
        throw new Error(error)
    }
})


// delete category 

const deleteCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id)
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    res.json(deletedCategory)
  } catch (error) {
      throw new Error(error)
     }
})


// get  category

const getCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id)
  try {
    const gottenCategory = await Category.findById(id);
    res.json(gottenCategory)
  } catch (error) {
      throw new Error(error)
     }
})


// get  category

const getallCategory = asyncHandler(async (req, res) => {
  try {
    const gottenCategory = await Category.find();
    res.json(gottenCategory)
  } catch (error) {
      throw new Error(error)
     }
})

module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getallCategory }