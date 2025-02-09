const express = require("express")

const router = express.Router()
const { registerUser, loginUser, findOneUser, findAllUsers } = require("../controllers/userController")

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/find/:userId", findOneUser)
router.get("/all", findAllUsers)




module.exports = router 