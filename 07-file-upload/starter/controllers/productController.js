const productSchema = require("../models/Product")
const { StatusCodes } = require("http-status-codes")
const cloudinary = require("../utils/cloudinary-config")

// const createProduct = async (req, res) => {
//     const product = await productSchema.create(req.body)

//     res.status(StatusCodes.CREATED).json({data: product})
// } 


const createProduct = async (req, res) => {
    const { name, price } = req.body;
    const file = req.file;
    console.log("file", file);

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log("file:", file);

    if(file.mimetype){
        // check image extension and size
    }

    // upload to cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
        use_filename: true,
        folder: 'NodeJS-Image-upload-course'
    });
    // console.log(result);
    console.log("result:", result);

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


//for multiple file uploads
    // try {
    //     const uploadedImages = [];

    //     for (const file of file) {
    //         // Upload each file to Cloudinary
    //         const result = await cloudinary.uploader.upload(file.path, {
    //             use_filename: true,
    //             folder: 'NodeJS-Image-upload-course'
    //         });

    //         uploadedImages.push(result.secure_url);
    //         console.log("results: ", result);
    //     }

    //     console.log("uploadedImages: ", uploadedImages);


    //     // Create new product with array of image URLs
    //     const newProduct = new productSchema({
    //         name,
    //         price,
    //         image: uploadedImages // Array of image URLs
    //     });


    //     const savedProduct = await newProduct.save();
    //     res.status(201).json({ data: savedProduct });

    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }