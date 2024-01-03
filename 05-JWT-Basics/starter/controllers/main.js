// const express = require("express")
// const router = express.Router()
const CustomAPIError = require( "../errors/custom-error")
const jwt = require("jsonwebtoken")

const login = async (req, res) => {
    const {username, password} = req.body
    if (!username || !password) {
        throw new CustomAPIError("please provide username and password", 400)
    }
 
    //for demo
    const id = new Date().getDate()

    //here we send the payload, jwt_secret(key), and options
    const token = jwt.sign({id, username}, process.env.JWT_SECRET, {expiresIn: "30d"})
    res.status(200).json({success: true, msg: "logged in", token})
}


const dashboard = async (req, res) => {
    const authHeader = req.headers.authorization //from the hearders
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomAPIError("No token provided", 401)
    }
    const token = authHeader.split(" ")[1] //we split it into two and pick the second index, which is the token itself
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET) 
        // console.log(decoded);
        const luckyNumber = Math.floor(Math.random() * 100)
        res.status(201).json({success: true, msg: `Hello ${decoded.username}`, secret: ` Here's your secret data ${luckyNumber}`})
    }catch(error){
        throw new CustomAPIError("Not auhtorized to access this route", 401)
    }
    
}

module.exports = {
    login,
    dashboard,
}