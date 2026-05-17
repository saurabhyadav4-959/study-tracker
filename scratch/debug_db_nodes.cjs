const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const User = require('../server/models/User');

async function debug() {
  try {
    console.log('Connecting to:', process.env.MONGODB_URI?.substring(0, 20) + '...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected');
    
    const students = await User.find({ role: 'student' });
    console.log('STUDENTS FOUND:', students.length);
    students.forEach(s => {
      console.log(`- ${s.name} (${s.email}): CODE=${s.studentCode}`);
    });

    const pending = await User.find({ role: 'pending' });
    console.log('PENDING NODES:', pending.length);
    pending.forEach(p => {
      console.log(`- ${p.name} (${p.email})`);
    });

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debug();
