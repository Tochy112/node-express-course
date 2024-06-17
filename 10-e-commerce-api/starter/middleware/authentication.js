const { BadRequestError, UnauthenticatedError, UnauthorizedError } = require("../errors/index")
const { isTokenValid } = require("../utils/jwt")

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token
    if(!token){
        throw new UnauthenticatedError("Authentication invalid")
    }
    
    try {
        const payload = isTokenValid({token})
        req.user = {userId: payload.userId, name: payload.name, role: payload.role} 
        next()
    } catch (error) {
        throw new UnauthenticatedError("Authentication invalid")
    }
} 

// check for roles
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            throw new UnauthorizedError("Inadequate permission to access this route")
        }
        next()
    }
}
module.exports = {
    authenticateUser,
    authorizePermissions
}