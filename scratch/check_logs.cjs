const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const ActivityLog = require('../server/models/ActivityLog');
const User = require('../server/models/User');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected');
    
    const logsCount = await ActivityLog.countDocuments();
    console.log('TOTAL LOGS IN DB:', logsCount);

    const recentLogs = await ActivityLog.find().sort({ timestamp: -1 }).limit(10);
    for (const log of recentLogs) {
      const user = await User.findById(log.userId);
      console.log(`- [${log.timestamp.toISOString()}] User: ${user?.name || log.userId} (${log.role}) Action: ${log.actionType}`);
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debug();
