const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Task = require('./models/Task');
const ActivityLog = require('./models/ActivityLog');
const Milestone = require('./models/Milestone');
const ParentStudentLink = require('./models/ParentStudentLink');

const MONGODB_URI = process.env.MONGODB_URI;
const JSON_FILE_PATH = path.join(__dirname, 'data/system_hub_db.json');

async function migrate() {
  try {
    console.log('--- SYSTEM HUB: NEURAL DATA MIGRATION ---');
    console.log('SOURCE: Local JSON');
    console.log('DESTINATION: MongoDB Atlas');
    
    await mongoose.connect(MONGODB_URI);
    console.log('STATUS: CONNECTED TO CLOUD');

    if (!fs.existsSync(JSON_FILE_PATH)) {
      console.log('SKIP: No local JSON file found.');
      process.exit(0);
    }

    const data = JSON.parse(fs.readFileSync(JSON_FILE_PATH, 'utf8'));

    // 1. Migrate Users
    console.log(`MIGRATING USERS (${data.users?.length || 0})...`);
    for (const u of data.users || []) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        // Map _id to ObjectId if it's already a string, otherwise let MongoDB generate
        const newUser = new User({ ...u });
        if (u._id && !u._id.startsWith('node_')) {
           // If it's a valid hex id, keep it? No, better let Mongo generate fresh if not sure.
        }
        await newUser.save();
      }
    }

    // 2. Migrate Tasks
    console.log(`MIGRATING TASKS (${data.tasks?.length || 0})...`);
    for (const t of data.tasks || []) {
      const exists = await Task.findById(t._id);
      if (!exists) {
        const newUser = await User.findOne({ name: t.userName }); 
        const taskData = { ...t };
        if (newUser) taskData.userId = newUser._id;
        await new Task(taskData).save();
      }
    }

    // 3. Migrate Logs
    console.log(`MIGRATING LOGS (${data.logs?.length || 0})...`);
    for (const l of data.logs || []) {
       const exists = await ActivityLog.findById(l._id);
       if (!exists) {
         await new ActivityLog({ role: 'student', ...l }).save();
       }
    }

    // 4. Migrate Milestones
    console.log(`MIGRATING MILESTONES (${data.milestones?.length || 0})...`);
    for (const m of data.milestones || []) {
       const exists = await Milestone.findById(m._id);
       if (!exists) {
         await new Milestone({ ...m }).save();
       }
    }

    // 5. Migrate Links
    console.log(`MIGRATING LINKS (${data.parent_student_links?.length || 0})...`);
    for (const link of data.parent_student_links || []) {
       const exists = await ParentStudentLink.findById(link._id);
       if (!exists) {
         await new ParentStudentLink({ ...link }).save();
       }
    }

    console.log('--- MIGRATION COMPLETE ---');
    console.log('Neural database is now synchronized with Cloud Atlas.');
    process.exit(0);
  } catch (err) {
    console.error('MIGRATION FAILED', err);
    process.exit(1);
  }
}

migrate();
