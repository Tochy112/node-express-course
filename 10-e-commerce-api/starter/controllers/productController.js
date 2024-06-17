const Product = require("../models/ProductModel")
const { BadRequestError } = require("../errors/index")
const { StatusCodes } = require("http-status-codes")
const cloudinary = require("../utils/cloudinary-config")

const createProduct = async (req, res) => {
    const file = req.file
    if(!file){
        throw new BadRequestError("No image uploaded")
    }
    const result = await cloudinary.uploader.upload(file.path, {
        use_filename: true,
        folder: 'NodeJS-e-commerce-course'
    });
    console.log(result);
    req.body.user = req.user.userId
    req.body.image = result.secure_url

    const newProduct = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({data: newProduct})
}

const getAllProducts = async (req, res) => {
    const products = await Product.find({})
    res.status(StatusCodes.OK).json({data: products, count: products.length})
}

const getSingleProduct = async (req, res) => {
    const productId = req.params.id
    const product = await Product.findOne({ _id: productId }).populate("reviews") // attach reviews 
    if (!product) {
        throw new BadRequestError(`No product with id: ${productId}`)
    }
    res.status(StatusCodes.OK).json({data: product})
}

const updateProduct = async (req, res) => {
    const productId = req.params.id
    const form = req.body
    const updatedProduct = await Product.findOneAndUpdate({_id: productId }, form, {
        new: true,
        runValidators: true
    })
    if (!updatedProduct) {
        throw new BadRequestError(`No product with id: ${productId}`)
    }
    res.status(StatusCodes.OK).json({data: updatedProduct})
}

const deleteProduct = async (req, res) => {
    const productId = req.params.id
    const product = await Product.findOne({ _id: productId })
    await product.deleteOne()
    res.status(StatusCodes.OK).json({msg: "product deleted successfully"})
}


module.exports = {
    createProduct,
    updateProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct
}
