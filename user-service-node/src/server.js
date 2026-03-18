require("dotenv").config()
const express = require("express")
const cors = require("cors")

const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")

const app = express()
console.log("JWT_SECRET:", process.env.JWT_SECRET)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json())

connectDB()

app.use("/auth",authRoutes)

app.listen(4000,()=>{
    console.log("User service running on port 4000")
})