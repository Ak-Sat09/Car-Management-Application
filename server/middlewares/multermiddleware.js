import multer from 'multer';

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploaded files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Name the file uniquely using the timestamp and original filename
  }
});

// Create a multer instance that accepts multiple files (images) and use the 'images' field in the form-data
const upload = multer({ storage: storage }).array('images');

export default upload;
