require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const fileUpload = require("express-fileupload")
const cloudinary = require('cloudinary').v2;


cloudinary.config({ 
  cloud_name: 'dsjqz3a9r', 
  api_key: '145249273393723', 
  api_secret: 'jrZQ9E0IHFEVGXb3pSBgJISVZ90' 
});

// database
const connectDB = require('./db/connect');

//routers
const ProductRouter = require("./routes/productRoutes")

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.static("./public")) // make the public folder publicly accessable
app.use(express.json())
app.use(fileUpload({useTempFiles: true})) // express file upload middleware

app.get('/', (req, res) => {
  res.send('<h1>File Upload Starter</h1>');
});

app.use("/api/v1/products", ProductRouter)

// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
