const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'parent', 'pending'], default: 'pending' },
  studentCode: { type: String, unique: true, sparse: true },
  linkedChildren: [{ type: String }], // Keeping as strings to match current linked logic easily
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
