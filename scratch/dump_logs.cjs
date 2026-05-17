const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const ActivityLog = require('../server/models/ActivityLog');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected');
    
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(5);
    console.log('LATEST LOGS IN DB:', JSON.stringify(logs, null, 2));

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debug();
