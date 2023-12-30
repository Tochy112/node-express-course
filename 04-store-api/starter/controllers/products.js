const productSchema = require("../models/product")

const getAllProducts = async (req, res) => {
    //here we set query params to enable filtering
    //we specified three params

    const {featured, company, name} = req.query
    const queryObject = {}

    console.log(queryObject);
    if (featured) {
        queryObject.featured = featured === "true" ? true : false
    }

    if (company) {
        queryObject.company = company
    }

    if (name) {
        queryObject.name = {$regex:name, $options: "i"} //set up regex for search purpose
    }
 
    //we pass an empty object here if we want to get all data
    const products = await productSchema.find(queryObject)
    console.log(req.query);
    res.status(200).json({success:true, data: products})
}

const getSingleProduct = async (req, res) => {
    const productID = req.params
    const product = await productSchema.findOne({_id: productID})
    res.status(200).json({success:true, data: product})
}

const createProduct = async (req, res) => {
    const product = await productSchema.create(req.body)
    res.status(200).json({success:true, data: product})
}

const updateProduct = async (req, res) => {
    const productID = req.params
    const product = await productSchema.findOneAndUpdate({_id: productID}, req.body)
    res.status(200).json({success:true, data: product})
}

const deleteProduct = async (req, res) => {
    const productID = req.params
    await productSchema.findOneAndDelete({_id: productID})
    res.status(200).json({success:true})
}

module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct
}