const pool = require('../config/db');
const bcrypt = require('bcryptjs');

module.exports = {
  createUser: async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    return result.insertId;
  },

  findUserByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  findUserById: async (id) => {
    const [rows] = await pool.query('SELECT id, username, email FROM users WHERE id = ?', [id]);
    return rows[0];
  },

 
  findUserByUsername: async (username) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  }
};