const { UnauthenticatedError } = require("../errors/index")
const jwt = require("jsonwebtoken")


const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError("Aunthentication Invalid")
    }
    const token = authHeader.split(" ")[1]
    try{
        //verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //attach user to the job routes
        req.user = {userId: payload.userId, name: payload.name}
        next()
    }catch(err){
        throw new UnauthenticatedError("Aunthentication Invalid")
    }
}

module.exports = authMiddleware