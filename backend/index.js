const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const dbConnect = require('./config/dbConnect');

const PORT = process.env.PORT || 4000;
const app = express();

dbConnect();

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});