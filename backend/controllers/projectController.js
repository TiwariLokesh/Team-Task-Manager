const projectModel = require('../models/projectModel')
const userModel = require('../models/userModel')
const asyncHandler = require('../utils/asyncHandler')

const listProjects = asyncHandler(async (req, res) => {
  const projects = await projectModel.listProjectsForUser(req.user.id, req.user.role)
  res.json(projects)
})

const createProject = asyncHandler(async (req, res) => {
  const { name } = req.body
  const projectId = await projectModel.createProject(name, req.user.id)

  await projectModel.addMember(projectId, req.user.id)

  res.status(201).json({ id: projectId, name })
})

const addMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params
  const { userId } = req.body

  const user = await userModel.findById(userId)
  if (!user) {
    return res.status(404).json({ message: 'User not found.' })
  }

  const added = await projectModel.addMember(projectId, userId)
  if (!added) {
    return res.json({ message: 'User is already a member.' })
  }

  return res.status(201).json({ message: 'Member added.' })
})

const removeMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params
  await projectModel.removeMember(projectId, userId)
  return res.json({ message: 'Member removed.' })
})

const listMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params
  const members = await projectModel.listMembers(projectId)
  res.json(members)
})

module.exports = { listProjects, createProject, addMember, removeMember, listMembers }
