// import your model and use the methods
const taskModel = require("../models/TaskSchema")

const getAllTasks = async (req, res) => {
    try{
        //query for fetching all existing data
        const tasks = await taskModel.find({})
        res.status(200).json({success: true, data: tasks} )
    }catch(err){
        res.status(500).json({success: false , data: err})
    } 
}

const createTask = async (req, res) => {
    try{
        //query for creating a new data
        const task = await taskModel.create(req.body) 
        res.status(201).json({success: true, data: task})
    }catch(err){
        res.status(500).json({success: false, data: err})
    }
}

const getSingleTask = async (req, res) => {
    try{
        const {id: taskId} = req.params
        const task = await taskModel.findOne({_id: taskId}) 
        
        if (!task) {
            res.status(404).json({success: false, data: `No task with id ${taskId} found`})
        }
        res.status(200).json({success: true, data: task})
    }catch(err){
        res.status(500).json({success: false, data: err})
    }
}

const editTask = async (req, res) => {
    try{
        const {id: taskId} = req.params

        //here we pass the options, new and runValidators for the update
        const task = await taskModel.findOneAndUpdate({_id: taskId}, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })
        

        if (!task) {
            res.status(404).json({success: false, data: `No task with id ${taskId} found`})
        }

        res.status(200).json({success: true, data: task})
    }catch(err){
        res.status(500).json({success: false, data: err})
    }
}

const deleteTask = async (req, res) => {
    try{
        const {id: taskId} = req.params
        const task = await taskModel.findOneAndDelete({_id: taskId}, {
            useFindAndModify: false
        })
    
        if (!task) {
            res.status(404).send({data: `No task with id: ${taskId} found`})
        }

        res.status(200).send({success: true})
    }catch(err){
        res.status(500).send({success: false, data: err})
    }
}



module.exports = {
    getAllTasks,
    createTask,
    getSingleTask,
    editTask,
    deleteTask
}