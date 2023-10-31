const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const dbConnect = require('./config/dbConnect');

const PORT = process.env.PORT || 4000;
const app = express();

dbConnect();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/category', prodcategoryRouter);
app.use('/api/brand', brandRouter);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});