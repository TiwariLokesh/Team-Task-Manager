const userModel = require('../models/userModel')
const asyncHandler = require('../utils/asyncHandler')

const listUsers = asyncHandler(async (req, res) => {
  const users = await userModel.listUsers()
  res.json(users)
})

module.exports = { listUsers }
