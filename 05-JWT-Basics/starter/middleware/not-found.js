const {StatusCodes} = require("http-status-codes") //here we import the status code library

const notFound = (req, res) => res.status(StatusCodes.NOT_FOUND).send('Route does not exist')

module.exports = notFound
