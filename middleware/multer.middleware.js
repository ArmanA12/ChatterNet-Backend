// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './public/temp');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;



const multer = require('multer');

const storage = multer.memoryStorage(); // Use memory storage

const upload = multer({ storage });

module.exports = upload;