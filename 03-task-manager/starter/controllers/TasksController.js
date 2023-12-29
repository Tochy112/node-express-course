// import your model and use the methods
const taskModel = require("../models/TaskSchema")
const asyncWrapper = require("../middleware/Async")
const {createCustomError} = require("../errors/CustomError")


const getAllTasks = asyncWrapper (async (req, res) => {
        //query for fetching all existing data
    const tasks = await taskModel.find({})
    res.status(200).json({success: true, data: tasks} )
})

const createTask = asyncWrapper (async (req, res) => {
    //query for creating a new data
    const task = await taskModel.create(req.body) 
    res.status(201).json({success: true, data: task})
})

const getSingleTask = asyncWrapper (async (req, res, next) => {
    const {id: taskId} = req.params
    const task = await taskModel.findOne({_id: taskId}) 
    
    if (!task) {
        return next(createCustomError(`No task with id ${taskId} found`, 404))
    }
    res.status(200).json({success: true, data: task})
})

const editTask = asyncWrapper( async (req, res) => {
    const {id: taskId} = req.params

    //here we pass the options, new and runValidators for the update
    const task = await taskModel.findOneAndUpdate({_id: taskId}, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    

    if (!task) {
        return next(createCustomError(`No task with id ${taskId} found`, 404))
    }

    res.status(200).json({success: true, data: task})
})

const deleteTask =  asyncWrapper (async (req, res) => {
    const {id: taskId} = req.params
    const task = await taskModel.findOneAndDelete({_id: taskId}, {
        useFindAndModify: false
    })

    if (!task) {
        return next(createCustomError(`No task with id ${taskId} found`, 404))
    }

    res.status(200).send({success: true})
})



module.exports = {
    getAllTasks,
    createTask,
    getSingleTask,
    editTask,
    deleteTask
}