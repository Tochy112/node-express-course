const mongoose = require("mongoose")

const UserModule = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email is required"],
        //A regular expression to validate an email
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
             "Please provide a valid email"
        ],
        unique: true
    },
    name: {
        type: String,
        required: [true, "username is required"],
        minlength: 2,
        maxlength: 50
    },
    password: {
        type: String,
        required: [true, "username is required"],
        minlength: 2,
    }
})


module.exports = mongoose.model("User", UserModule )