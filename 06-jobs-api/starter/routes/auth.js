const express = require("express")
const router = express.Router()

const {Login, Register, getAllUsers} = require("../controllers/auth")

router.route("/register").post(Register)
router.route("/login").post(Login)
router.route("/users").get(getAllUsers)

module.exports = router