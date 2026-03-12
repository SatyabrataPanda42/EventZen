require("dotenv").config()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//for register
exports.register = async (req, res) => {
    try {

        const { name, email, password } = req.body
        const normalizedEmail = email.toLowerCase().trim()

        // Name validation
        if (!name || name.length < 3 || name.length > 50) {
            return res.status(400).json({ message: "Name must be between 3 and 50 characters" })
        }

        // Password validation
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
            return res.status(400).json({ message: "Invalid email format" })
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: normalizedEmail })

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" })
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10)

        const user = new User({
            name,
            email: normalizedEmail,
            password: hashed
        })

        await user.save()

        res.status(201).json({
            message: "User registered successfully",
            user
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//For login
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body
        const normalizedEmail = email.toLowerCase().trim()

        const user = await User.findOne({ email: normalizedEmail })

        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        const valid = await bcrypt.compare(password, user.password)

        if (!valid) {
            return res.status(401).json({ message: "Invalid password" })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.json({ token })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Fetching all users
exports.users = async (req, res) => {
    try {

        const users = await User.find().select("-password")

        res.json(users)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}