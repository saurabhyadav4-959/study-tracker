const express = require('express');
const router = express.Router();
const db = require('../db_adapter');
const auth = require('../middleware/auth');

// Link a child by Student Code
router.post('/link', auth, async (req, res) => {
  try {
    const { studentCode } = req.body;
    const parentId = req.user.id;
    const parent = db.users.findById(parentId);

    if (!parent || parent.role !== 'parent') {
      return res.status(403).json({ message: 'UNAUTHORIZED: SUPERVISOR ACCESS ONLY' });
    }

    const student = db.users.findOne({ studentCode, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'INVALID STUDENT CODE: NODE NOT FOUND' });
    }

    // Check if link already exists
    const existing = db.parent_student_links.find({ parentId, studentId: student._id });
    if (existing.length > 0) {
      return res.status(400).json({ message: 'NEURAL LINK ALREADY ESTABLISHED' });
    }

    // Establish the link
    db.parent_student_links.insert({ parentId, studentId: student._id });

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

    const data = require('../db_adapter').users.findById(parentId); // Refresh check
    if (!data || data.role !== 'parent') {
      return res.status(403).json({ message: 'UNAUTHORIZED: SUPERVISOR ACCESS ONLY' });
    }

    const links = db.parent_student_links.find({ parentId, studentId });
    if (links.length === 0) {
      return res.status(404).json({ message: 'LINK NOT FOUND: DIVERGENCE FAILED' });
    }

    // In a real DB we'd use a proper delete. Here we filter and save.
    const fullData = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '../data/system_hub_db.json'), 'utf8'));
    fullData.parent_student_links = fullData.parent_student_links.filter(l => !(l.parentId === parentId && l.studentId === studentId));
    require('fs').writeFileSync(require('path').join(__dirname, '../data/system_hub_db.json'), JSON.stringify(fullData, null, 2));

    res.json({ message: 'NEURAL LINK SEVERED: DIVERGENCE COMPLETE' });
  } catch (err) {
    res.status(500).json({ message: 'DIVERGENCE ERROR', error: err.message });
  }
});

// Get all linked children with stats
router.get('/children', auth, async (req, res) => {
  try {
    const parentId = req.user.id;
    const links = db.parent_student_links.find({ parentId });
    const childrenIds = links.map(l => l.studentId);
    
    const childrenData = childrenIds.map(childId => {
      const child = db.users.findById(childId);
      if (!child) return null;

      const logs = db.logs.find({ userId: childId });
      const tasks = db.tasks.find({ userId: childId });
      
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = logs.filter(l => l.timestamp.startsWith(today));
      const studyMinutesToday = todayLogs.reduce((acc, log) => acc + (log.timeSpent || 0), 0);
      const totalStudyTime = logs.reduce((acc, log) => acc + (log.timeSpent || 0), 0);
      
      const lastLog = logs.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      
      return {
        id: child._id,
        name: child.name,
        email: child.email,
        totalStudyTime,
        studyMinutesToday,
        completedTasks: tasks.filter(t => t.status === 'Done').length,
        totalTasks: tasks.length,
        streak: 0, // Simplified for now
        alerts: [],
        latestSubject: logs.length > 0 ? logs[logs.length-1].description.split(':')[0] : 'None',
      };
    }).filter(Boolean);

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

    const link = db.parent_student_links.find({ parentId, studentId: childId });
    if (link.length === 0) {
      return res.status(403).json({ message: 'ACCESS DENIED: NODE NOT LINKED' });
    }

    const child = db.users.findById(childId);
    const tasks = db.tasks.find({ userId: childId });
    const logs = db.logs.find({ userId: childId });

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
    const links = db.parent_student_links.find({ parentId });
    const childrenIds = links.map(l => l.studentId);
    
    let allLogs = [];
    childrenIds.forEach(childId => {
      const child = db.users.findById(childId);
      if (child) {
        let logs = db.logs.find({ userId: childId });
        logs = logs.map(log => ({ ...log, childName: child.name }));
        allLogs = allLogs.concat(logs);
      }
    });
    
    allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    res.json(allLogs);
  } catch (err) {
    res.status(500).json({ message: 'FEED GENERATION FAILED', error: err.message });
  }
});

module.exports = router;
