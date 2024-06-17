require("dotenv").config()
require("express-async-errors")

//express
const express = require("express")
const app = express()

//packages 
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/authRoutes")
const userRouter = require("./routes/userRoutes")
const productRouter = require("./routes/productRoutes")
const reviewRouter = require("./routes/reviewRoutes")
const orderRouter = require("./routes/orderRoutes")

//database
const connectDB = require("./db/connect")

const errorHandlerMiddleware = require("./middleware/error-handler")
const notFoundMiddleware = require("./middleware/not-found")

app.use(morgan("tiny")) //used for logging http req
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET)) // middleware to enable us access the cookies on the browser (signed cookie)


app.get("/api/v1", (req, res) => {
    console.log(res.signedCookies);
    res.send("hello world")
})

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/orders", orderRouter)

//middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)




let port = process.env.PORT || 5000

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`server listening at port ${port}`);
        })
    }catch(e){
        console.log(e);
    }
}

start()