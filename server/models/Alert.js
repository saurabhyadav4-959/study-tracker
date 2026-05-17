const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    default: () => 'alert_' + Math.random().toString(36).substr(2, 9) 
  },
  userId: { type: String, required: true }, // Student
  parentId: { type: String, required: true },
  taskName: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);
