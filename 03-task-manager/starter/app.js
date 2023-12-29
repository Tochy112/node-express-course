// impory the connectDB function
const connectDB = require('./db/connect')
const express = require('express')
const NotFound = require("./middleware/NotFound")
const ErrorHandlerMiddleware = require("./middleware/ErrorHandler")


//access the .env file
require('dotenv').config()

const app = express()
const taskRouter = require('./routes/TaskRoutes')

// use static files
app.use(express.static("./public"))

// middleware to allow json access
app.use(express.json())


// set the router
app.use('/api/v1/tasks', taskRouter)

//for wrong routes
app.use(NotFound)

// error handler
app.use(ErrorHandlerMiddleware)

// here we set the port value from the environment variable
const port = process.env.PORT || 3000

// connect to the db using the .env url 
const start = async () => {
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => console.log(`listening at port ${port}`));
    }catch(err){
        console.log(err);
    }
}

start()