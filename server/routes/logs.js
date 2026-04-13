const express = require('express');
const router = express.Router();
const db = require('../db_adapter');
const auth = require('../middleware/auth');

// Post a new activity log
router.post('/', auth, async (req, res) => {
  try {
    const { actionType, description, timeSpent, studentId } = req.body;
    const log = db.logs.insert({
      userId: req.user.id,
      role: req.user.role,
      actionType,
      description,
      timeSpent,
      studentId
    });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: 'LOGGING ERROR', error: err.message });
  }
});

// Get logs (with filtering)
router.get('/', auth, async (req, res) => {
  try {
    const { studentId, actionType, startDate, endDate } = req.query;
    let query = {};

    if (req.user.role === 'parent') {
      if (studentId && studentId !== 'all') {
        query.userId = studentId;
      } else {
        const parent = db.users.findById(req.user.id);
        query.userId = { $in: parent.linkedChildren || [] };
      }
    } else {
      query.userId = req.user.id;
    }

    if (actionType) query.actionType = actionType;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = startDate;
      if (endDate) query.timestamp.$lte = endDate;
    }

    const logs = db.logs.find(query);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'QUERY ERROR', error: err.message });
  }
});

module.exports = router;
