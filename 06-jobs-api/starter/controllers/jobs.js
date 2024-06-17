const jobsModel = require("../models/Job")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError  } = require("../errors/index")

const getAllJobs = async (req, res) => {
    const jobs = await jobsModel.find({createdBy:  req.user.userId}).sort("createdAt")
    res.status(StatusCodes.OK).json({data: jobs, count: jobs.length})
}

const getSingleJob = async (req, res) => {
    const {id: jobId} = req.params
    const { userId } = req.user

    const job = await jobsModel.findOne({_id:jobId, createdBy: userId})
    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`)
    }
    res.status(StatusCodes.OK).json({data: job})
}

const createJob = async (req, res) => {
    req.body.createdBy =  req.user.userId //assign a user to the job
    const newJob = await jobsModel.create(req.body)
    res.status(StatusCodes.CREATED).json({data: newJob})
}

const updateJob = async (req, res) => {
    const {id: jobId} = req.params
    const { userId } = req.user
    const { body:{company, position} } = req //destructure body prop from req

    if (company === " " || position === " ") {
        throw new BadRequestError("Company or position fields can't be empty")
    }

    const job = await jobsModel.findOneAndUpdate(
        {_id:jobId, createdBy: userId}, 
        req.body, 
        { new: true, runValidators: true}
        )
    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async (req, res) => {
    const {id: jobId} = req.params
    const { userId } = req.user

    const job = await jobsModel.findOneAndDelete({_id:jobId, createdBy: userId})
    if (!job) {
        throw new NotFoundError(`No job with id: ${jobId}`)
    }
    res.status(StatusCodes.OK).json({success: true})
}

module.exports = {
    getAllJobs,
    getSingleJob,
    createJob,
    updateJob,
    deleteJob
}