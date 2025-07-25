exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const [task] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!task.length) return res.status(404).json({ error: 'Task not found' });
    res.json(task[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const pool = require('../config/db');

exports.getTasks = async (req, res) => {
  try {
    const [tasks] = await pool.query('SELECT * FROM tasks');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const [result] = await pool.query('INSERT INTO tasks (title, description, completed, createdAt) VALUES (?, ?, ?, NOW())', [title, description, false]);
    const [task] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(task[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const [result] = await pool.query('UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?', [title, description, completed, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });
    const [task] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(task[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
