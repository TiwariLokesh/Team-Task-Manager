const pool = require('../config/db')

const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
  return rows[0]
}

const findById = async (id) => {
  const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [id])
  return rows[0]
}

const createUser = async (name, email, password, role) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  )
  return result.insertId
}

const listUsers = async () => {
  const [rows] = await pool.query(
    'SELECT id, name, email, role FROM users ORDER BY name ASC'
  )
  return rows
}

module.exports = { findByEmail, findById, createUser, listUsers }
