const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbid");

const createBrand = asyncHandler(async (req, res) => { 
    try {
        const newBrand = await Brand.create(req.body)
        res.json(newBrand);
    } catch (error) {
        throw new Error(error)
    }
})


// update Brand

const updateBrand = asyncHandler(async (req, res) => { 
    const id = req.params.id
    validateMongoDbId(id)
    try {
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true})
        updatedBrand.save()
        res.json(updatedBrand);
    } catch (error) {
        throw new Error(error)
    }
})


// delete Brand 

const deleteBrand = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id)
  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);
    res.json(deletedBrand)
  } catch (error) {
      throw new Error(error)
     }
})


// get  Brand

const getBrand = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id)
  try {
    const gottenBrand = await Brand.findById(id);
    res.json(gottenBrand)
  } catch (error) {
      throw new Error(error)
     }
})


// get  Brand

const getallBrand = asyncHandler(async (req, res) => {
  try {
    const gottenBrand = await Brand.find();
    res.json(gottenBrand)
  } catch (error) {
      throw new Error(error)
     }
})

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrand
};
