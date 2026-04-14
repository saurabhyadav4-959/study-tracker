const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  _id: { type: String },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  track: { type: String },
  deadline: { type: Date },
  status: { type: String, enum: ['Todo', 'Progress', 'Done'], default: 'Todo' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
