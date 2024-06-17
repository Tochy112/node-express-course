const mongoose = require("mongoose")
const Review = require("./ReviewModel")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please provide product name"],
        maxlength: [100, "Name can't be more than 100 characters"]
    },
    price: {
        type: Number,
        required: [true, "Please provide product price"],
        default: 0
    },
    description: {
        type: String,
        required: [true, "Please provide product description"],
        maxlength: [1000, "Description can't be more than 1000 characters"]
    },
    image: {
        type: String,
        required: [true, "Please provide product image"],
        default: "./uploads/image.jpg"
    },
    category: {
        type: String,
        required: [true, "Please provide product category"],
        enum: ['office', 'kitchen', 'bedroom']
    },
    company: {
        type: String,
        required: [true, "Please provide company"],
        enum: {
            values: ['ikea', 'liddy', 'marcos'],
            message: '{VALUE} is not supported'
        }
    },
    colors: {
        type: [String],
        required: true,
        default: ['#ff6961', '#77b5fe']
    },
    featured: {
        type: Boolean,
        default: false
    },
    freeShipping: {
        type: Boolean,
        default: false
    },
    inventory: {
        type: Number,
        required: true,
        default: 15
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}})

//here we append the reviews schema as a virtual schema to be able to access it in the products schema
productSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "product",
    justOne: false
})

// we create a pre delete method to eneble us delete reviews of a deleted product
productSchema.pre("deleteOne",{ document: true, query: false }, async function() {
    await this.model('Review').deleteMany({
        product: this._id
    })
})


module.exports = mongoose.model("Products", productSchema)