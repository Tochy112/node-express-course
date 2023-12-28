// impory the connectDB function
const connectDB = require('./db/connect')
const express = require('express')

//access the .env file
require('dotenv').config()

const app = express()
const taskRouter = require('./routes/TaskRoutes')

// middleware to allow json access
app.use(express.json())

// set the router
app.use('/api/v1/tasks', taskRouter)
const port = 3000

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