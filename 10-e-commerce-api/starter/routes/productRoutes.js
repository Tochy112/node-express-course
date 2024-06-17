const app = require("express")
const { authorizePermissions, authenticateUser } = require("../middleware/authentication")
const storage = require("../utils/multer-config") // import multer and storage
const multer = require("multer")

const upload = multer({ storage: storage });

const { 
getAllProducts,
getSingleProduct,
updateProduct,
deleteProduct,
createProduct
} = require("../controllers/productController")

const router = app.Router()

router.route("/")
.post(authenticateUser, authorizePermissions("admin"), upload.single('image'), createProduct)
.get(getAllProducts)

router.route("/:id")
.get(getSingleProduct)
.patch(authenticateUser, authorizePermissions("admin"), updateProduct)
.delete(authenticateUser, authorizePermissions("admin"), deleteProduct)

module.exports = router