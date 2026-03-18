const express = require("express")
const router = express.Router()

const authController = require("../controllers/authController")

const { authMiddleware } = require("../middleware/authMiddleware")
const { adminMiddleware } = require("../middleware/adminMiddleware")

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/users", authMiddleware, adminMiddleware, authController.users)
router.put("/update-role/:id", authMiddleware, adminMiddleware, authController.updateRole)
router.delete("/delete/:id", authMiddleware, adminMiddleware, authController.deleteUser);

module.exports = router