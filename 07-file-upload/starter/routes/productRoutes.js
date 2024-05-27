const express = require("express")
const { createProduct, getAllProducts } = require("../controllers/productController")
const { uploadProductImage } = require("../controllers/uploadsController")
const multer = require('multer');
const storage = require("../utils/multer-config") // import multer and storage


const upload = multer({ storage: storage });

const router = express.Router()

router.route("/")
.post(upload.single('image'), createProduct) // include upload the route
.get(getAllProducts)

router.route("/uploads")
.post(uploadProductImage)

module.exports = router