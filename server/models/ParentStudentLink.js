const mongoose = require('mongoose');

const parentStudentLinkSchema = new mongoose.Schema({
  _id: { type: String },
  parentId: { type: String, required: true },
  studentId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ParentStudentLink', parentStudentLinkSchema);
