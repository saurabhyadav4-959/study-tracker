const express = require('express');
const router = express.Router();
const db = require('../db_adapter');
const auth = require('../middleware/auth');

// Link a child by Student Code
router.post('/link', auth, async (req, res) => {
  try {
    const { studentCode } = req.body;
    const parentId = req.user.id;
    const parent = await db.users.findById(parentId);

    if (!parent || parent.role !== 'parent') {
      return res.status(403).json({ message: 'UNAUTHORIZED: SUPERVISOR ACCESS ONLY' });
    }

    const student = await db.users.findOne({ studentCode, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'INVALID STUDENT CODE: NODE NOT FOUND' });
    }

    // Check if link already exists
    const existing = await db.parent_student_links.find({ parentId, studentId: student._id });
    if (existing.length > 0) {
      return res.status(400).json({ message: 'NEURAL LINK ALREADY ESTABLISHED' });
    }

    // Establish the link
    await db.parent_student_links.insert({ parentId, studentId: student._id });

    res.json({ message: 'NEURAL LINK SYNCHRONIZED', student: { id: student._id, name: student.name, email: student.email } });
  } catch (err) {
    res.status(500).json({ message: 'LINKAGE FAILED', error: err.message });
  }
});

// Sever a link to a child
router.delete('/link/:studentId', auth, async (req, res) => {
  try {
    const parentId = req.user.id;
    const { studentId } = req.params;

    // Use MongoDB delete
    const result = await require('../models/ParentStudentLink').findOneAndDelete({ parentId, studentId });
    if (!result) {
      return res.status(404).json({ message: 'LINK NOT FOUND: DIVERGENCE FAILED' });
    }

    res.json({ message: 'NEURAL LINK SEVERED: DIVERGENCE COMPLETE' });
  } catch (err) {
    res.status(500).json({ message: 'DIVERGENCE ERROR', error: err.message });
  }
});

// Get all linked children with stats
router.get('/children', auth, async (req, res) => {
  try {
    const parentId = req.user.id;
    const links = await db.parent_student_links.find({ parentId });
    const childrenIds = links.map(l => l.studentId);
    
    const childrenData = [];
    for (const childId of childrenIds) {
      const child = await db.users.findById(childId);
      if (!child) continue;

      const logs = await db.logs.find({ userId: childId });
      const tasks = await db.tasks.find({ userId: childId });
      
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = logs.filter(l => new Date(l.timestamp).toISOString().split('T')[0] === today);
      const studyMinutesToday = todayLogs.reduce((acc, log) => acc + (log.timeSpent || 0), 0);
      const totalStudyTime = logs.reduce((acc, log) => acc + (log.timeSpent || 0), 0);
      
      childrenData.push({
        id: child._id,
        name: child.name,
        email: child.email,
        totalStudyTime,
        studyMinutesToday,
        completedTasks: tasks.filter(t => t.status === 'Done').length,
        totalTasks: tasks.length,
        streak: 0, 
        alerts: [],
        latestSubject: logs.length > 0 ? logs[0].description.split(':')[0] : 'None',
      });
    }

    res.json(childrenData);
  } catch (err) {
    res.status(500).json({ message: 'DIAGNOSTICS FAILED', error: err.message });
  }
});

// Logic for other routes like assign-task and child/:id should similarly use db.parent_student_links
// I will keep them compatible with the new link structure.
router.get('/child/:id', auth, async (req, res) => {
  try {
    const parentId = req.user.id;
    const { id: childId } = req.params;

    const link = await db.parent_student_links.find({ parentId, studentId: childId });
    if (link.length === 0) {
      return res.status(403).json({ message: 'ACCESS DENIED: NODE NOT LINKED' });
    }

    const child = await db.users.findById(childId);
    const tasks = await db.tasks.find({ userId: childId });
    const logs = await db.logs.find({ userId: childId });

    res.json({
      profile: { id: child._id, name: child.name, email: child.email, xp: child.xp || 0, level: child.level || 1 },
      tasks,
      logs: logs.slice(0, 50)
    });
  } catch (err) {
    res.status(500).json({ message: 'DEEP SCAN FAILED', error: err.message });
  }
});

// Feed of all children logs combined
router.get('/activity-feed', auth, async (req, res) => {
  try {
    const parentId = req.user.id;
    const links = await db.parent_student_links.find({ parentId });
    const childrenIds = links.map(l => l.studentId);
    
    let allLogs = [];
    for (const childId of childrenIds) {
      const child = await db.users.findById(childId);
      if (child) {
        let logs = await db.logs.find({ userId: childId });
        const logsWithNames = logs.map(log => ({ 
          ...log.toObject ? log.toObject() : log, 
          childName: child.name 
        }));
        allLogs = allLogs.concat(logsWithNames);
      }
    }
    
    allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    res.json(allLogs);
  } catch (err) {
    res.status(500).json({ message: 'FEED GENERATION FAILED', error: err.message });
  }
});

module.exports = router;
