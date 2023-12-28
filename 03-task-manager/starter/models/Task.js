const mongoose = require('mongoose')

// Here we create our db schema with validators
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "must provide title "],
        trim: true,
        maxlength: [20, "name cannot be more than 20 characters"]
    },
    completed: {
        type: Boolean,
        default: false
    }
})

// export the module
module.exports = mongoose.model("Task", taskSchema )