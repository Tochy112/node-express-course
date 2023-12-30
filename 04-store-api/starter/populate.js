require("dotenv").config()

const productSchema = require("./models/product")
const products = require("./products.json")
const connectDB = require("./db/connect")

const start = async() => {
    try {
        await connectDB(process.env.DB_URL)
        await productSchema.deleteMany()
        await productSchema.create(products)
        console.log("sucess!!!");
        process.exit(0)
    } catch (error) {
        console.log("error");        
        process.exit(1)
    }
}

start()