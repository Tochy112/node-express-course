const { BadRequestError } = require("../errors/index")
const { StatusCodes } = require("http-status-codes")
const Review = require("../models/ReviewModel")
const Product = require("../models/ProductModel")
const { checkPermission } = require("../utils/checkPermissions")

const createReview = async (req, res) => {
    const form = req.body
    const productId = form.product

    //check if product exits
    const isValidProduct = await Product.findOne({
        _id: productId
    })
    
    if (!isValidProduct) {
        throw new BadRequestError("Product not found")
    }

    const newReview = new Review({
        user: req.user.userId,
        ...form
    })
   await newReview.save()
    res.status(StatusCodes.CREATED).json({data: newReview})
}

const getAllReviews = async (req, res) => {
    //get all reviews of a particular product
    //you can add pagination to this and some filter query params
    // we use populate to fetch back details of a table it has a relation with, here we specified the data we want using select
    const productId = req.query
    const reviews = await Review.find({
        product: productId.product
    })
    .sort("-createdAt")
    .populate({path: "product", select: "name company price"})
    .populate({path: "user", select: "name email"})

    res.status(StatusCodes.OK).json({data: reviews, count: reviews.length})
}

const getSingleReview = async (req, res) => {
    const reviewId = req.params.id
    
    const review = await Review.findOne({
        _id: reviewId
    })
    .populate({path: "product", select: "name company price"})
    .populate({path: "user", select: "name email"})

    if(!review){
        throw new BadRequestError("Review not found")
    }
    res.status(StatusCodes.OK).json({data: review})
}

const updateReview = async (req, res) => {
    const reviewId = req.params.id
    const {comment, rating, title} = req.body

    const review = await Review.findOne(
        { _id: reviewId}
    )
    if(!review){
        throw new BadRequestError("Review not found")
    }
    //check if the user owns the review or is an admin
    checkPermission(req.user, review.user)

    review.comment = comment
    review.rating = rating
    review.title = title

    await review.save()
    res.status(StatusCodes.OK).json({data: review})
}


const deleteReview = async (req, res) => {
    const reviewId = req.params.id

    // check if the review exits
    const review = await Review.findOne({
        _id: reviewId
    })

    if(!review){
        throw new BadRequestError("Review not found")
    }
    //check if the user owns the review or is an admin
    checkPermission(req.user, review.user)
    await review.deleteOne()

    res.status(StatusCodes.OK).json({msg: "Review deleted successfully"})
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview
}