const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  _id: { type: String },
  studentId: { type: String, required: true }, // Using string ID to match current logic
  node: { type: String },
  type: { type: String, enum: ['streak', 'tasks', 'time'] },
  title: { type: String, required: true },
  targetValue: { type: Number, required: true },
  rewardBadge: { type: String },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  progress: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Milestone', milestoneSchema);
