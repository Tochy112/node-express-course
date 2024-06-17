require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

//extra security
const helmet = require("helmet")
const cors = require("cors")
const xss  = require("xss-clean")
const rateLimiter = require("express-rate-limit")


//connect DB
const connectDB = require("./db/connect")

//auth middleware
const authMiddleware = require("./middleware/authentication")

//routers
const AuthRouter = require("./routes/auth")
const JobsRouter = require("./routes/jobs")

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.use(rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
}))
app.use(express.json());
app.use(helmet)
app.use(cors)
app.use(xss)
// extra packages

// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/jobs', authMiddleware, JobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
