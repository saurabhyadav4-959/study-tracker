const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    default: () => 'node_' + Math.random().toString(36).substr(2, 9) 
  },
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'INVALID EMAIL FORMAT']
  },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['student', 'parent', 'pending'], default: 'pending' },
  studentCode: { type: String, unique: true, sparse: true },
  linkedChildren: [{ type: String }],
  dashboardState: { type: Object, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
