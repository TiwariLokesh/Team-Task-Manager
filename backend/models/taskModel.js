const pool = require('../config/db')

const createTask = async (payload) => {
  const {
    title,
    description,
    due_date,
    priority,
    status,
    assigned_to,
    project_id,
  } = payload

  const [result] = await pool.query(
    `INSERT INTO tasks (title, description, due_date, priority, status, assigned_to, project_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, due_date || null, priority, status, assigned_to, project_id]
  )
  return result.insertId
}

const listTasksForUser = async (userId, role) => {
  if (role === 'admin') {
    const [rows] = await pool.query(
      `SELECT t.*, u.name AS assigneeName, p.name AS projectName
       FROM tasks t
       JOIN users u ON u.id = t.assigned_to
       JOIN projects p ON p.id = t.project_id
       ORDER BY t.id DESC`
    )
    return rows
  }

  const [rows] = await pool.query(
    `SELECT t.*, u.name AS assigneeName, p.name AS projectName
     FROM tasks t
     JOIN users u ON u.id = t.assigned_to
     JOIN projects p ON p.id = t.project_id
     WHERE t.assigned_to = ?
     ORDER BY t.id DESC`,
    [userId]
  )
  return rows
}

const getTaskById = async (taskId) => {
  const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId])
  return rows[0]
}

const updateTaskStatus = async (taskId, status) => {
  await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, taskId])
}

module.exports = { createTask, listTasksForUser, getTaskById, updateTaskStatus }
