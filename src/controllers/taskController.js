const pool = require('../config/db');

// ✅ Fetch all tasks for the logged-in user
exports.getTasksByUser = async (req, res) => {
  try {
    console.log('User ID:', req.user?.id); 
    const userId = req.user.id;
    const [tasks] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ?',
      [userId]
    );
    console.log('Found tasks:', tasks.length); 
    res.json(tasks);
  } catch (err) {
    console.error('Error in getTasksByUser:', err); 
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [task] = await pool.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!task.length) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Add a new task
exports.addTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, completed, user_id) VALUES (?, ?, ?, ?)',
      [title, description, false, userId]
    );

    const [task] = await pool.query(
      'SELECT * FROM tasks WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(task[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update an existing task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const userId = req.user.id;

    const [existingTask] = await pool.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!existingTask.length) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await pool.query(
      'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ? AND user_id = ?',
      [title, description, completed, id, userId]
    );

    const [updatedTask] = await pool.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );

    res.json(updatedTask[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [existingTask] = await pool.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!existingTask.length) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await pool.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
