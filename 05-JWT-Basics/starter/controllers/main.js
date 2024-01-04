// const express = require("express")
// const router = express.Router()
const CustomAPIError = require( "../errors/custom-error")
const jwt = require("jsonwebtoken")
const { BadRequest } = require("../errors")


const login = async (req, res) => {
    const {username, password} = req.body
    if (!username || !password) {
        throw new BadRequest("please provide username and password")
    }
 
    //for demo
    const id = new Date().getDate()

    //here we send the payload, jwt_secret(key), and options
    const token = jwt.sign({id, username}, process.env.JWT_SECRET, {expiresIn: "30d"})
    res.status(200).json({success: true, msg: "logged in", token})
}


const dashboard = async (req, res) => {
   
    const luckyNumber = Math.floor(Math.random() * 100)
    const user = req.user
    console.log(user);
    res.status(201).json(
    {
        success: true, 
        msg: `Hello ${user.username}`, 
        secret: ` Here's your secret data ${luckyNumber}`
    }
)}

module.exports = {
    login,
    dashboard,
}