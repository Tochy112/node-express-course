const app = require("express")
const router = app.Router()
const { authenticateUser, authorizePermissions } = require("../middleware/authentication")


const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
 } = require("../controllers/userController")

router.route("/")
.get(authenticateUser, authorizePermissions("admin"), getAllUsers)

router.route("/updateUser")
.patch(authenticateUser, updateUser)

router.route("/showMe")
.get(authenticateUser, showCurrentUser)

router.route("/updatePassword")
.patch(authenticateUser, updateUserPassword)

router.route("/:id")
.get(authenticateUser, getSingleUser)



module.exports = router