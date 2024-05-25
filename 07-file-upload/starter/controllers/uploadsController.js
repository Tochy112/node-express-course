const { StatusCodes } = require("http-status-codes")
const path = require("path")
const { BadRequestError } = require("../errors/index")
const cloudinary = require('cloudinary').v2;
const fs = require("fs")
          

const uploadProductImageLocal = async (req, res) => {

    //check if file exists
    if (!req.files) {
        throw new BadRequestError("No file uploaded")
    }

    const productImage = req.files.image

    //check mimetype
    if (productImage.mimetype.startsWith("image")) {
        throw new BadRequestError("Please upload an image")
    }

    //check size
    const maxSize = 1000
    if (productImage.size > maxSize) {
        throw new BadRequestError("Image is more than 1Kb")
    }

    const imagePath = path.join(__dirname, "../public/uploads", `${productImage.name}`)

    //move image to another destination
    await productImage.mv(imagePath)

    return res.status(StatusCodes.CREATED).json({image: {src: `/uploads/${productImage.name}`} })
} 

const uploadProductImage = async (req, res) => {
    const imagePath = req.files.image.tempFilePath;

    const result = await cloudinary.uploader.upload(imagePath, {
        use_filename: true, folder: "NodeJS-Image-upload-course"
    })
    
    //delete tempfile path after upload
    fs.unlinkSync(imagePath)
    // console.log(result);
    return res.status(StatusCodes.OK).json({image: {src: result.secure_url}})
    
}

module.exports = {
    uploadProductImage
}