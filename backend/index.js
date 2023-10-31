const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 4000;
const app = express();


app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});