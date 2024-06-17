const userModule = require("../models/User")
const {StatusCodes} = require("http-status-codes")
const {BadRequestError, UnauthenticatedError} = require("../errors/index")

const Register = async (req, res) => {
    const user = await userModule.create({...req.body})
    const token = user.createJwt()

    res.status(StatusCodes.CREATED).json({user: {name: user.name}, token})
}

const Login = async (req, res) => {
 const {email, password} = req.body
 //check for email and password
 if (!email || !password) {
    throw new BadRequestError("Please provide email and password")
 }
 //look for an existing user with the email
 const user = await userModule.findOne({email})

 //if none, throw an error
 if(!user){
    throw new UnauthenticatedError("Invalid Credentials")
 }

 //compare passwords
 const isPasswordCorrect = await user.comparePassword(password)
 if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid password")
 }

 //create token if user exists
 const token = user.createJwt()

 res.status(StatusCodes.OK).json({user: {name: user.name}, token})
}

const getAllUsers = async (req, res) => {
    const users = await userModule.find({})
    res.status(StatusCodes.OK).json({users, count: users.length})
}


module.exports = {
    Register,
    Login,
    getAllUsers
}