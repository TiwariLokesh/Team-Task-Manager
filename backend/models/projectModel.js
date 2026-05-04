const pool = require('../config/db')

const createProject = async (name, createdBy) => {
  const [result] = await pool.query(
    'INSERT INTO projects (name, created_by) VALUES (?, ?)',
    [name, createdBy]
  )
  return result.insertId
}

const listProjectsForUser = async (userId, role) => {
  if (role === 'admin') {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, u.name AS ownerName,
        (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.id) AS memberCount
       FROM projects p
       JOIN users u ON u.id = p.created_by
       ORDER BY p.id DESC`
    )
    return rows
  }

  const [rows] = await pool.query(
    `SELECT p.id, p.name, u.name AS ownerName,
      (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.id) AS memberCount
     FROM project_members pm
     JOIN projects p ON p.id = pm.project_id
     JOIN users u ON u.id = p.created_by
     WHERE pm.user_id = ?
     ORDER BY p.id DESC`,
    [userId]
  )
  return rows
}

const addMember = async (projectId, userId) => {
  const [result] = await pool.query(
    'INSERT INTO project_members (project_id, user_id) VALUES (?, ?)',
    [projectId, userId]
  )
  return result.insertId
}

const removeMember = async (projectId, userId) => {
  await pool.query('DELETE FROM project_members WHERE project_id = ? AND user_id = ?', [
    projectId,
    userId,
  ])
}

const listMembers = async (projectId) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.role
     FROM project_members pm
     JOIN users u ON u.id = pm.user_id
     WHERE pm.project_id = ?
     ORDER BY u.name ASC`,
    [projectId]
  )
  return rows
}

module.exports = { createProject, listProjectsForUser, addMember, removeMember, listMembers }
