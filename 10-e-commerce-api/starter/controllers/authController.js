const User = require("../models/UserModel")
const { BadRequestError, UnauthenticatedError } = require("../errors/index")
const { StatusCodes } = require("http-status-codes")
const jwt = require("jsonwebtoken")
const { attachCookiesToResponse } = require("../utils/jwt")

const register = async (req, res) => {
    const { email, name, password, roles } = req.body
    
    const emailAlreadyExists = await User.findOne({
        email
    })

    if(emailAlreadyExists){
        throw new BadRequestError("Email already exists")
    }

    const user = await User.create({
        email, name, password, roles
    })

    const tokenUser = {
        name: user.name, userId: user._id, role: user.roles
    }
    attachCookiesToResponse({res, user: tokenUser})
    
    res.status(StatusCodes.CREATED).json({data: tokenUser})
}

const login = async (req, res) => {

    const { email, password } = req.body

    if(!email || !password){
        throw new BadRequestError("Please provide email and password")
    }

    const user = await User.findOne({
        email
    })
    if (!user) {
        throw new UnauthenticatedError("Invalid Credentials")
    }
    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Incorrect Password")
    }

    const tokenUser = {
        name: user.name, userId: user._id, role: user.roles
    }
    attachCookiesToResponse({res, user: tokenUser})

    res.status(StatusCodes.OK).json({data: tokenUser})
}

const logout = async (req, res) => {
    //set cookie to an empty string
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now())
    })

    res.status(StatusCodes.OK).send()
}


module.exports = {
    register,
    login,
    logout
}