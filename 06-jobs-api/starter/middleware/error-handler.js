// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let CustomError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later"
  }

  //validation errors
  if (err.name === 'ValidationError') {
    CustomError.msg = Object.values(err.errors).map((item) => item.message).join(",")
    CustomError.statusCode = StatusCodes.BAD_REQUEST
  }

  //check for duplicate details errors
  if (err.code && err.code === 11000) {
    CustomError.msg = `duplicate value for ${Object.keys( err.keyValue )} field found`,
    CustomError.statusCode = StatusCodes.BAD_REQUEST
  }

  //item not found error
  if (err.name === "CastError") {
    CustomError.msg = `No item of id ${err.value} found`,
    CustomError.statusCode = StatusCodes.NOT_FOUND
  }

  //  
  return res.status(CustomError.statusCode).json({ msg: CustomError.msg})
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
}

module.exports = errorHandlerMiddleware
