

class CustomApiError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
    }
}

const createCustomError = (data, statusCode) => {
    return new CustomApiError(data, statusCode) 
}

module.exports = {
    createCustomError,
    CustomApiError
}