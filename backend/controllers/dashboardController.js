const pool = require('../config/db')
const asyncHandler = require('../utils/asyncHandler')

const getDashboard = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin'

  const [totalRows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM tasks
     ${isAdmin ? '' : 'WHERE assigned_to = ?'}`,
    isAdmin ? [] : [req.user.id]
  )

  const [statusRows] = await pool.query(
    `SELECT status, COUNT(*) AS count
     FROM tasks
     ${isAdmin ? '' : 'WHERE assigned_to = ?'}
     GROUP BY status`,
    isAdmin ? [] : [req.user.id]
  )

  const [overdueRows] = await pool.query(
    `SELECT COUNT(*) AS overdue
     FROM tasks
     WHERE due_date IS NOT NULL
       AND due_date < CURDATE()
       AND status <> 'Done'
       ${isAdmin ? '' : 'AND assigned_to = ?'}`,
    isAdmin ? [] : [req.user.id]
  )

  let tasksPerUser = []
  if (isAdmin) {
    const [rows] = await pool.query(
      `SELECT u.id AS userId, u.name AS userName, COUNT(t.id) AS taskCount
       FROM users u
       LEFT JOIN tasks t ON t.assigned_to = u.id
       GROUP BY u.id, u.name
       ORDER BY taskCount DESC`
    )
    tasksPerUser = rows
  }

  const statusCounts = statusRows.reduce((acc, row) => {
    acc[row.status] = row.count
    return acc
  }, {})

  res.json({
    totalTasks: totalRows[0]?.total || 0,
    statusCounts,
    tasksPerUser,
    overdueTasks: overdueRows[0]?.overdue || 0,
  })
})

module.exports = { getDashboard }
