const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const uniqid = require('uniqid')

const { validateMongoDbId } = require('../utils/validateMongoDbid');
const { generateRefreshToken } = require('../config/refreshToken');
const { generateToken } = require('../config/jwtToken');
const { sendEmail } = require('./emailCtrl');
const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const Coupon = require('../models/couponModel')
const Order = require('../models/orderModel')

// create new User

const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    // create new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error('User Already Exists');
  }
});

// create new Admin

const createAdmin = asyncHandler(async (req, res) => {
  const { email, firstname, lastname, password, mobile } = req.body;
  const findAdmin = await User.findOne({ email });
  if (!findAdmin) {
    const newadmin = {
      email, firstname, lastname, password, mobile, role: "admin"
    }
    // create new user
    const newAdmin = await User.create(newadmin);
    res.json(newAdmin);
  } else {
    throw new Error('User Already Exists');
  }
});

// login user

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken,
      },
      { new: true },
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error('Invalid Credentials');
  }
});

// admin login

const loginAdminCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists
  const findUser = await User.findOne({ email });
  if (findUser.role !== 'admin') throw new Error('Not Authorized');
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken,
      },
      { new: true },
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error('Invalid Credentials');
  }
});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies');
  const { refreshToken } = cookie;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(' No Refresh token present in db or not matched');
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error('There is something wrong with refresh token');
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// logout functionality

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies');
  const { refreshToken } = cookie;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate({ refreshToken }, {
    refreshToken: '',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });
  res.status(200).json({ message: 'logged Out successfully'}); // forbidden
});

// update a user

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstname: req?.body.firstname,
        lastname: req?.body.lastname,
        email: req?.body.email,
        mobile: req?.body.mobile,
      },
      {
        new: true,
      },
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// get a single user

const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getaUser = await User.findById(id);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get all users

const getallUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// delete a single user

const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// block a user

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      },
    );
    res.json({
      message: 'User blocked',
    });
  } catch (error) {
    throw new Error(error);
  }
});

// unblock a user

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      },
    );
    res.json({
      message: 'User unblocked',
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update password

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

// forgot password token

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found with this mail');
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Kindly follow this link to reset your password. This link is valid for only ten minutes. <a href='http://localhost:5000/api/user/reset-password/${token}'> Click Here</>`;
    const data = {
      to: email,
      subject: 'Forgot Password Link',
      text: 'Hello User',
      html: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

// Reset Password

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error(' Token Expired, Please try again later ');
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});


// save user address

const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updatedUserAddress = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      { new: true },
    );
    res.json(updatedUserAddress);
  } catch (error) {
    throw new Error(error);
  }
});

// Get Wishlist

const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});


// create user cart

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let products = [];
    const user = await User.findById(_id);
    // check if user has product in cart
    const alreadyExistCart = await Cart.findOne({ orderby: user._id }).exec();
    console.log(alreadyExistCart); // Log the resul
    if (alreadyExistCart) {
      // Check if alreadyExistCart is not null or undefined
      await alreadyExistCart.deleteOne(); // Remove the document
    }
    for (let i = 0; i < cart.length; i++) {
      console.log("running the for loop")
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select('price').exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    console.log(products, cartTotal);
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

// get User cart

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({orderby:_id}).populate("products.product")
    res.json(cart)
  } catch (error) {
    throw new Error(error)
  }
});

// empty cart

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
  const user = await User.findOne({_id});
  const cart = await Cart.findOneAndRemove({ orderby: user._id });
  res.json(cart)
  } catch (error) {
    throw new Error(error)
  }
});

// apply coupon

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon == null ) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({ orderby: user._id });
  let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount},
    { new: true }
    );
    res.json(totalAfterDiscount)
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    if (!COD) throw new Error("Create cash order failed")
    const user = await User.findById(_id);
  let userCart = await Cart.findOne({ orderby: user._id });
  let finalAmount = 0;
  if (couponApplied && userCart.totalAfterDiscount) {
    finalAmount = userCart.totalAfterDiscount;
  } else {
    finalAmount = userCart.cartTotal;
  }

  let newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uniqid(),
      method: "COD",
      amount: finalAmount,
      status: "Cash on Delivery",
      created: Date.now(),
      currency: 'ngn',
    },
    orderby: user._id,
    orderStatus: 'Cash on Delivery'
    }).save();

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id:item.product._id },
          update: {$inc: {quantity: -item.count, sold: +item.count }}
        }
      }
    })
    const updated = await Product.bulkWrite(update, {});
    res.json({message: 'success'})
  } catch (error) {
      throw new Error(error);
  }
});


// get order

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userorders = await Order.findOne({ orderby: _id }).populate('products.product').exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});


// update order status

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(id,
      { 
        orderStatus: status,
        paymentIntent: {
          status: status,
        }
      },
      { new: true }
      );
      res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error)
  }
});


module.exports = {
  createUser,
  createAdmin,
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
  createOrder,
  getOrders,
  updateOrderStatus,
  saveAddress
};
