const {CustomApiError} = require("../errors/CustomError")

const ErrorHandler = (err, req, res, next) => {
    if (err instanceof CustomApiError) {
        return res.status(err.statusCode).json({data: err.message})
    }
    return res.status(500).json({success: false,  data: "something went wrong"})
}

module.exports = ErrorHandler