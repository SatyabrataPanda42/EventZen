const express = require("express")
const cors = require("cors")

const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.use("/auth",authRoutes)

app.listen(4000,()=>{
    console.log("User service running on port 4000")
})