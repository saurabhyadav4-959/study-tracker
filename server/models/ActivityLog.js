const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to student for parent view
  role: { type: String, required: true },
  actionType: { type: String, required: true }, // LOGIN, ADD_TASK, COMPLETE_TASK, STUDY_SESSION
  description: { type: String },
  timeSpent: { type: Number, default: 0 }, // In minutes
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
