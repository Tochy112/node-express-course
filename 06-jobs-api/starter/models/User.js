const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


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
        required: [true, "password  is required"],
        minlength: 2,
    }
})

//here we hash our password before saving the model
UserModule.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next();
  });

  //create the jwt using the mongoose model instance
UserModule.methods.createJwt = function() {
    return jwt.sign({userId: this._id, name:this.name},  process.env.JWT_SECRET , {expiresIn: process.env.JWT_LIFETIME})
}

//compare user imputed password with password in the DB
UserModule.methods.comparePassword = async function(candidatePassword) {
    const ismatch = await bcrypt.compare(candidatePassword, this.password )
    return ismatch
}



module.exports = mongoose.model("User", UserModule )