// src/routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const verifyToken = require('../middleware/auth');

// All task routes 
router.use(verifyToken); // ✅ Protect all routes

// GET all tasks for authenticated user
router.get('/', taskController.getTasksByUser); 

// GET a specific task by ID
router.get('/:id', taskController.getTaskById);

// POST (create) a new task
router.post('/', taskController.addTask);

// PUT (update) a task
router.put('/:id', taskController.updateTask);

// DELETE a task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
