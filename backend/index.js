const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dbConnect = require('./config/dbConnect');
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const categoryRouter = require('./routes/categoryRoute');
const brandRouter = require('./routes/brandRoute');
const couponRouter = require('./routes/couponRoute');
const { notFound, errorHandler } = require('./middlewares/errorHandler');


const PORT = process.env.PORT || 4000;
const app = express();

dbConnect();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', couponRouter);

app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});