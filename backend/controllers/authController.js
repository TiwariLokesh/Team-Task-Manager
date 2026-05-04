const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const asyncHandler = require('../utils/asyncHandler')

const createToken = (user) =>
  jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body

  const existing = await userModel.findByEmail(email)
  if (existing) {
    return res.status(409).json({ message: 'Email already registered.' })
  }

  const hashed = await bcrypt.hash(password, 10)
  const safeRole = role === 'admin' ? 'admin' : 'member'
  const userId = await userModel.createUser(name, email, hashed, safeRole)
  const user = await userModel.findById(userId)

  const token = createToken(user)
  return res.status(201).json({ user, token })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await userModel.findByEmail(email)
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' })
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials.' })
  }

  const token = createToken(user)
  return res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  })
})

module.exports = { signup, login }
