 const productSchema = require("../models/product")

const getAllProducts = async (req, res) => {
    //here we set query params to enable filtering
    //we specified three params

    const {featured, company, name, sort, fields, numericFilters} = req.query
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

    //created a sort feature
    let result = productSchema.find(queryObject)

    if (sort) {
        const sortList = sort.split(",").join(" ")
        result = result.sort(sortList)
    }else{
        result = result.sort("createdAt")
    }

    //create a select feature to display a certain data from the response 
    if (fields) {
        const fieldList = fields.split(",").join(" ")
        result = result.select(fieldList)
    }

    //add a page and limit queries
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10 
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    //here we create a filtering feature using numbers
    // we convert the normal comparison signs to that of the mongoose
    //all of this (mongoose signs) are in the mongoose docs
    if (numericFilters) {
        const operatorMap = {
            ">": "$gt",
            "<": "$lt",
            ">=": "$gte",
            "<=": "$lte",
            "=": "$eq",
        }

        const regEX = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regEX, 
            (match) => `-${operatorMap[match]}-`
        )

        // const result = result.numericFilters(filters)
        const options = ["price", "rating"]
        filters = filters.split(",").forEach((item) => {
            const [field, operator, value] = item.split("-")
            if (options.includes(field)) {
                queryObject[field] = {[operator]: Number(value)}
            } 
        });
    }
    console.log(queryObject);

    const products = await result.find(queryObject)
    const nbHits = products.length
    console.log(req.query);
    res.status(200).json({success:true, data: products, nbHits, page, limit})
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