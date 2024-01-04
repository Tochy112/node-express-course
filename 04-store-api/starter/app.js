require("dotenv").config()

const connectDB = require("./db/connect")
const router = require("./routes/products")

// access the async error package
require("express-async-errors")

const express = require('express')
const app = express()

//error handlers
const notFoundMiddleware = require("./middleware/not-found")
const errorMiddleware = require("./middleware/error-handler")

//midddleware
app.use(express.json())

//routes
app.get("/", (req, res) => {
    res.send("<h1>Store API</h1> <a href='/api/v1/products'>products route</a>")
})

//set base path for our router
app.use("/api/v1/products", router) 

app.use(notFoundMiddleware)
app.use(errorMiddleware)


const port = process.env.PORT || 4000
const start = async () => {
    try {
        await connectDB(process.env.DB_URL)
        app.listen(port, console.log(`server listening at port ${port}`))
    } catch (error) {
        console.log(error);
    }
}
start()