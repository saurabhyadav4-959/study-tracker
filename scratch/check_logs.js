const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected.');
    const ActivityLog = require('../server/models/ActivityLog');
    const logs = await ActivityLog.find({});
    console.log(`Found ${logs.length} logs.`);
    if (logs.length > 0) {
      console.log('Latest log:', logs[logs.length - 1]);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
