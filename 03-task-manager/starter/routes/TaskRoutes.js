const express = require('express')
const router = express.Router()
const {
    getAllTasks,
    createTask,
    getSingleTask,
    editTask,
    deleteTask
} = require('../controllers/TasksController')


router.route('/').get(getAllTasks).post(createTask)
router.route('/:id').get(getSingleTask).patch(editTask).delete(deleteTask)

module.exports = router