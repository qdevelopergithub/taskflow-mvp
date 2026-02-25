const express = require('express');
const router = express.Router();
const TaskModel = require('../models/task');

// GET /api/tasks/stats
router.get('/stats', (req, res) => {
  try {
    const Task = TaskModel(req.app.locals.db);
    const stats = Task.getStats();
    res.json({ data: stats });
  } catch (err) {
    console.error('Error getting stats:', err);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// GET /api/tasks
router.get('/', (req, res) => {
  try {
    const Task = TaskModel(req.app.locals.db);
    const { status, priority } = req.query;
    const tasks = Task.getAll({ status, priority });
    res.json({ data: tasks });
  } catch (err) {
    console.error('Error listing tasks:', err);
    res.status(500).json({ error: 'Failed to list tasks' });
  }
});

// GET /api/tasks/:id
router.get('/:id', (req, res) => {
  try {
    const Task = TaskModel(req.app.locals.db);
    const task = Task.getById(Number(req.params.id));
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: task });
  } catch (err) {
    console.error('Error getting task:', err);
    res.status(500).json({ error: 'Failed to get task' });
  }
});

// POST /api/tasks
router.post('/', (req, res) => {
  try {
    const { title, description, status, priority, due_date } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (status && !['todo', 'in_progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority' });
    }

    const Task = TaskModel(req.app.locals.db);
    const task = Task.create({ title: title.trim(), description, status, priority, due_date });
    res.status(201).json({ data: task });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  try {
    const { title, description, status, priority, due_date } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    if (status && !['todo', 'in_progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority' });
    }

    const Task = TaskModel(req.app.locals.db);
    const task = Task.update(Number(req.params.id), {
      title: title?.trim(),
      description,
      status,
      priority,
      due_date,
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: task });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// PATCH /api/tasks/:id/status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['todo', 'in_progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Valid status required (todo, in_progress, done)' });
    }

    const Task = TaskModel(req.app.locals.db);
    const task = Task.updateStatus(Number(req.params.id), status);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: task });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  try {
    const Task = TaskModel(req.app.locals.db);
    const deleted = Task.delete(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.json({ data: { message: 'Task deleted' } });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
