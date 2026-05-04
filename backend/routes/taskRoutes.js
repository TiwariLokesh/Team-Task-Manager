const express = require('express')
const { body, param } = require('express-validator')
const taskController = require('../controllers/taskController')
const auth = require('../middleware/auth')
const requireRole = require('../middleware/roles')
const validate = require('../middleware/validate')

const router = express.Router()

router.get('/', auth, taskController.listTasks)

router.post(
  '/',
  auth,
  requireRole('admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority.'),
    body('status').isIn(['To Do', 'In Progress', 'Done']).withMessage('Invalid status.'),
    body('assigned_to').isInt().withMessage('Assignee is required.'),
    body('project_id').isInt().withMessage('Project is required.'),
  ],
  validate,
  taskController.createTask
)

router.patch(
  '/:taskId/status',
  auth,
  [
    param('taskId').isInt().withMessage('Task id is required.'),
    body('status').isIn(['To Do', 'In Progress', 'Done']).withMessage('Invalid status.'),
  ],
  validate,
  taskController.updateStatus
)

module.exports = router
