const CustomAPIError = require( "../errors/custom-error")
const jwt = require("jsonwebtoken")
const { UnAuthenticatedError } = require("../errors")

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization //from the hearders
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnAuthenticatedError("No token provided")
    }
    const token = authHeader.split(" ")[1] //we split it into two and pick the second index, which is the token itself
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET) 
        const {id, username} = decoded
        req.user = {id, username}
        next()

    }catch(error){
        throw new UnAuthenticatedError("Not auhtorized to access this route")
    }    
}

module.exports = authMiddleware