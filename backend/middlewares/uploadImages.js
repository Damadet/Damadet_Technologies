const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Specify the directory path
const directoryPath = path.join(__dirname, '../public/images/products');

// Check if the directory exists
if (!fs.existsSync(directoryPath)) {
  // If it doesn't exist, create the directory
  fs.mkdir(directoryPath, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating directory:', err);
    } else {
      console.log('Directory created successfully.');
    }
  });
} else {
  console.log('Directory already exists.');
};

const multerStorage = multer.diskStorage({
  // This function specifies the directory where the uploaded files will be saved.
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  // This function defines the filename for the saved file
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}.jpeg`);
  },
});


// make sure the document is an image

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb({
      message: 'Unsupported file format',
    }, false);
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2000000 },
  field: 'image',
});

const productImgResize = async (req, res, next) => {
  if (!req.files) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }
  await Promise.all(req.files.map(
    async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file.filename}`);
      fs.unlinkSync(`public/images/products/${file.filename}`);
    },
  ));
  next();
};

module.exports = { uploadPhoto, productImgResize };
