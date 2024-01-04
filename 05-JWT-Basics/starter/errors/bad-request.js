const CustomeAPIError =  require("./custom-error")
const {StatusCodes} = require("http-status-codes") //here we import the status code library

class BadRequest extends CustomeAPIError {
    constructor(message) {
      super(message)
      this.statusCode = StatusCodes.BAD_REQUEST //(400)
    }
  }
  
  module.exports = BadRequest
  