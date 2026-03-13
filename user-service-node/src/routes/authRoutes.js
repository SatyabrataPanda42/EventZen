const express = require("express")
const router = express.Router()

const authController = require("../controllers/authController")

const { authMiddleware } = require("../middleware/authMiddleware")
const { adminMiddleware } = require("../middleware/adminMiddleware")

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/users", authController.users)
router.put("/update-role/:id", authMiddleware, adminMiddleware, authController.updateRole)

module.exports = router