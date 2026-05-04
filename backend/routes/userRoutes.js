const express = require('express')
const auth = require('../middleware/auth')
const requireRole = require('../middleware/roles')
const userController = require('../controllers/userController')

const router = express.Router()

router.get('/', auth, requireRole('admin'), userController.listUsers)

module.exports = router
