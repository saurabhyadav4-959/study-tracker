const mongoose = require('mongoose');

const parentStudentLinkSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    default: () => 'link_' + Math.random().toString(36).substr(2, 9) 
  },
  parentId: { type: String, required: true },
  studentId: { type: String, required: true },
  restrictions: {
    isLocked: { type: Boolean, default: false },
    dailyGoalHours: { type: Number, default: 4 },
    lockMessage: { type: String, default: 'SYSTEM RESTRICTED: COMPLETE YOUR OBJECTIVES TO UNLOCK CORE FUNCTIONS.' }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ParentStudentLink', parentStudentLinkSchema);
