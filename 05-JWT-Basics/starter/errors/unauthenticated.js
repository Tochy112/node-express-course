const CustomeAPIError =  require("./custom-error")
const { StatusCodes } = require("http-status-codes") //here we import the status code library


class UnAuthenticatedError extends CustomeAPIError {
    constructor(message) {
      super(message)
      this.statusCode = StatusCodes.UNAUTHORIZED //401
    }
  }
  
  module.exports = UnAuthenticatedError
  