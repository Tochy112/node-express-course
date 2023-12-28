const mongoose = require('mongoose')

// connect to mongo db using mongoose
const connectDB = (url) => {
   return  mongoose.connect( url, 
    { 
    useNewUrlParser: true,    
    useUnifiedTopology: true 
    })
}

module.exports = connectDB 

 