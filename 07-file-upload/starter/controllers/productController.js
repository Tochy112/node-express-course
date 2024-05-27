const productSchema = require("../models/Product")
const { StatusCodes } = require("http-status-codes")
const cloudinary = require('cloudinary').v2
const { v4: uuidv4 } = require('uuid');


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET 
  });


// const createProduct = async (req, res) => {
//     const product = await productSchema.create(req.body)

//     res.status(StatusCodes.CREATED).json({data: product})
// } 


const createProduct = async (req, res) => {
    const { name, price } = req.body;
    const file = req.file;
    // console.log("file", file);

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    // upload to cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
        use_filename: true,
        folder: 'NodeJS-Image-upload-course'
    });
    // console.log("result:", result);

    const newProduct = new productSchema({
        name,
        price,
        image: result.secure_url
    });
    // console.log("new-product:", newProduct);

    const savedProduct = await newProduct.save();
    // console.log("saved-product:", savedProduct);

    res.status(201).json({data: savedProduct});
};

const getAllProducts = async (req, res) => {
    const product = await productSchema.find({})

    res.status(StatusCodes.OK).json({data: product})
} 


module.exports = {
    createProduct,
    getAllProducts,
}