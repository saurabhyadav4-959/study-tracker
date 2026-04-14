const express = require('express');
const router = express.Router();
const db = require('../db_adapter');
const auth = require('../middleware/auth');

// Get milestones for student
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const milestones = await db.milestones.find({ childId: userId });
    
    // Fetch student data for verification
    const tasks = await db.tasks.find({ userId });
    const logs = await db.logs.find({ userId });
    
    const updatedMilestones = await Promise.all(milestones.map(async m => {
      if (m.status === 'completed') return m;

      // Verification logic based on type
      let currentVal = 0;
      if (m.type === 'tasks') {
        currentVal = tasks.filter(t => t.status === 'Done').length;
      } else if (m.type === 'time') {
        currentVal = logs.reduce((acc, log) => acc + (log.timeSpent || 0), 0) / 60; // in hours
      }

      if (currentVal >= m.targetValue) {
        return await db.milestones.update(m._id, { status: 'completed', completedAt: new Date().toISOString() });
      }
      return m;
    }));

    res.json(updatedMilestones);
  } catch (err) {
    res.status(500).json({ message: 'SYNCHRONIZATION ERROR', error: err.message });
  }
});

// Get milestones for a specific child (for parents)
router.get('/child/:childId', auth, async (req, res) => {
  try {
    const parentId = req.user.id;
    const { childId } = req.params;

    // Verify link
    const link = await db.parent_student_links.find({ parentId, studentId: childId });
    if (link.length === 0) {
      return res.status(403).json({ message: 'ACCESS DENIED: NODE NOT LINKED' });
    }

    const milestones = await db.milestones.find({ childId });
    res.json(milestones);
  } catch (err) {
    res.status(500).json({ message: 'DIAGNOSTICS FAILED', error: err.message });
  }
});

// Create a new milestone (Parent only)
router.post('/', auth, async (req, res) => {
  try {
    const parentId = req.user.id;
    const { childId, title, description, type, targetValue, rewardBadge } = req.body;

    // Verify link
    const link = await db.parent_student_links.find({ parentId, studentId: childId });
    if (link.length === 0) {
      return res.status(403).json({ message: 'ACCESS DENIED: NODE NOT LINKED' });
    }

    const milestone = await db.milestones.insert({
      parentId,
      childId,
      title,
      description,
      type,
      targetValue,
      rewardBadge,
      status: 'active'
    });

    res.json(milestone);
  } catch (err) {
    res.status(500).json({ message: 'DEPLOYMENT FAILED', error: err.message });
  }
});

module.exports = router;
