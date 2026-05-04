const express = require('express')
const { body, param } = require('express-validator')
const projectController = require('../controllers/projectController')
const auth = require('../middleware/auth')
const requireRole = require('../middleware/roles')
const validate = require('../middleware/validate')

const router = express.Router()

router.get('/', auth, projectController.listProjects)

router.post(
  '/',
  auth,
  requireRole('admin'),
  [body('name').trim().notEmpty().withMessage('Project name is required.')],
  validate,
  projectController.createProject
)

router.get(
  '/:projectId/members',
  auth,
  [param('projectId').isInt().withMessage('Project id is required.')],
  validate,
  projectController.listMembers
)

router.post(
  '/:projectId/members',
  auth,
  requireRole('admin'),
  [
    param('projectId').isInt().withMessage('Project id is required.'),
    body('userId').isInt().withMessage('User id is required.'),
  ],
  validate,
  projectController.addMember
)

router.delete(
  '/:projectId/members/:userId',
  auth,
  requireRole('admin'),
  [
    param('projectId').isInt().withMessage('Project id is required.'),
    param('userId').isInt().withMessage('User id is required.'),
  ],
  validate,
  projectController.removeMember
)

module.exports = router
