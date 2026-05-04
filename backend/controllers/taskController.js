const taskModel = require('../models/taskModel')
const userModel = require('../models/userModel')
const asyncHandler = require('../utils/asyncHandler')

const listTasks = asyncHandler(async (req, res) => {
  const tasks = await taskModel.listTasksForUser(req.user.id, req.user.role)
  res.json(tasks)
})

const createTask = asyncHandler(async (req, res) => {
  const assignee = await userModel.findById(req.body.assigned_to)
  if (!assignee) {
    return res.status(404).json({ message: 'Assignee not found.' })
  }

  const taskId = await taskModel.createTask(req.body)
  res.status(201).json({ id: taskId })
})

const updateStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params
  const { status } = req.body

  const task = await taskModel.getTaskById(taskId)
  if (!task) {
    return res.status(404).json({ message: 'Task not found.' })
  }

  const isOwner = Number(task.assigned_to) === Number(req.user.id)
  // Members can only update the status of tasks assigned to them.
  if (req.user.role !== 'admin' && !isOwner) {
    return res.status(403).json({ message: 'You can only update your own tasks.' })
  }

  await taskModel.updateTaskStatus(taskId, status)
  res.json({ message: 'Status updated.' })
})

module.exports = { listTasks, createTask, updateStatus }
