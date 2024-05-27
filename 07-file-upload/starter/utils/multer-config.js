const multer = require('multer');
const path = require("path")


const storage = multer.diskStorage({
    // creates a destination path to save files in the disk locally
    destination: (req, file, cb) => {
        cb(null, "/uploads"); 
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

module.exports = storage