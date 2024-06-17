const User = require("../models/UserModel")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError} = require("../errors/index")
const { attachCookiesToResponse } = require("../utils/jwt")
const { checkPermission } = require("../utils/checkPermissions")

const getAllUsers = async (req, res) => {
    // fetch accounts with role of user and remove the password from the returned response 
    console.log(req.user);
    const users = await User.find({
        roles: "user",
    }).select("-password")
    const length = users.length
    
    res.status(StatusCodes.OK).json({data: users, length })
}

const getSingleUser = async (req, res) => {

    const userId = req.params.id

    const user = await User.findOne({
        _id: userId
    }).select("-password")

    checkPermission(req.user, user._id)
    
    res.status(StatusCodes.OK).json({data: user})
}


const showCurrentUser = async (req, res) => {
    loggedInUser = req.user
    res.status(StatusCodes.OK).json({user: loggedInUser})
}

const updateUser = async (req, res) => {
    const { name, email } = req.body
    const id = req.user.userId
    if (!name || !email) {
        throw new BadRequestError("Please fill all fields")
    }

    // we tend to not use the save() method here due to the hashing of the user password while saving the data
    // findOneAndUpdate works fine here with no further configurations
    // using a save method will trigger the pre save hook which will hash our passwords again, altering the value
    const updatedUser = await User.findOneAndUpdate(
        {_id: id},
        {name, email},
        {new: true, runValidators: true}
    )

    const tokenUser = {
        userId: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.roles
    }
    attachCookiesToResponse({res, user: tokenUser})

    res.status(StatusCodes.OK).json({data: tokenUser})
}

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword} = req.body
    const id = req.user.userId
    if (!oldPassword || !newPassword) {
        throw new BadRequestError("please fill both fields")
    }

    const user = await User.findOne({
        _id: id
    })

    const isPasswordCorrect = await user.comparePassword(oldPassword)

    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Password is not correct")
    }

    user.password = newPassword
    // this works fine here cause we are updating just the password
    // this will trigger the pre save hook
    await user.save() 

    res.status(StatusCodes.OK).json({msg: "password updated" })
}


module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}
