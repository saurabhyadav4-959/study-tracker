const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  _id: { type: String },
  userId: { type: String, required: true },
  studentId: { type: String }, // Reference to student for parent view
  role: { type: String, required: true },
  actionType: { type: String, required: true }, // LOGIN, ADD_TASK, COMPLETE_TASK, STUDY_SESSION
  description: { type: String },
  timeSpent: { type: Number, default: 0 }, // In minutes
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
