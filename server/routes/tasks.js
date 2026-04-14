const express = require('express');
const router = express.Router();
const db = require('../db_adapter');
const auth = require('../middleware/auth');

// Sync tasks from frontend
router.post('/sync', auth, async (req, res) => {
  try {
    const { tasks } = req.body;
    if (!Array.isArray(tasks)) return res.status(400).json({ message: 'INVALID DATA FORMAT' });

    for (const t of tasks) {
      await db.tasks.upsert(
        { userId: req.user.id, title: t.title },
        { ...t, userId: req.user.id }
      );
    }

    res.json({ message: 'TASKS SYNCHRONIZED' });
  } catch (err) {
    res.status(500).json({ message: 'SYNC ERROR', error: err.message });
  }
});

module.exports = router;
