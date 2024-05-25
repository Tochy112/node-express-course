const productSchema = require("../models/Product")
const { StatusCodes } = require("http-status-codes")

const createProduct = async (req, res) => {
    const product = await productSchema.create(req.body)

    res.status(StatusCodes.CREATED).json({data: product})
} 

const getAllProducts = async (req, res) => {
    const product = await productSchema.find({})

    res.status(StatusCodes.OK).json({data: product})
} 


module.exports = {
    createProduct,
    getAllProducts
}