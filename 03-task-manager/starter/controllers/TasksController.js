// import your model and use the methods
const taskModel = require("../models/Task")

const getAllTasks = (req, res) => {
    res.status(200).json({success: true, data: "all tasks"})
}

const createTask = async (req, res) => {
    const task = await taskModel.create(req.body)
    res.status(201).json({success: true, data: task})
}

const getSingleTask = (req, res) => {
    res.status(200).json({success: true, data: "single task"})
}

const editTask = (req, res) => {
    res.status(200).json({success: true, data: "updated tasks"})
}

const deleteTask = (req, res) => {
    res.status(200).send({success: true})
}



module.exports = {
    getAllTasks,
    createTask,
    getSingleTask,
    editTask,
    deleteTask
}