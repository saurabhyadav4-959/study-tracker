const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db_adapter');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Use adapter
    const existingUser = db.users.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'NODE ALREADY INDEXED' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = db.users.insert({ 
      name, 
      email, 
      password: hashedPassword, 
      role: 'pending', // Force onboarding protocol
      linkedChildren: [] 
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'neural_secret_key');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'SYNTHESIS ERROR', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.users.findOne({ email });
    if (!user) return res.status(400).json({ message: 'NODE NOT FOUND' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'INVALID CREDENTIALS' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'neural_secret_key');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'AUTHORIZATION ERROR', error: err.message });
  }
});

// Update Role (Onboarding)
router.post('/role', auth, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'parent'].includes(role)) return res.status(400).json({ message: 'INVALID ROLE PROTOCOL' });

    const updates = { role };
    
    // Generate unique student code if role is student
    if (role === 'student') {
      let unique = false;
      let code = '';
      while (!unique) {
        code = 'STU-' + Math.random().toString(36).substr(2, 5).toUpperCase();
        const existing = db.users.findOne({ studentCode: code });
        if (!existing) unique = true;
      }
      updates.studentCode = code;
    }

    const user = db.users.update(req.user.id, updates);
    res.json({ message: 'IDENTITY SYNTHESIZED', user: { id: user._id, name: user.name, role: user.role, studentCode: user.studentCode } });
  } catch (err) {
    res.status(500).json({ message: 'DIVERGENCE ERROR', error: err.message });
  }
});

module.exports = router;
