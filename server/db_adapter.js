const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Task = require('./models/Task');
const ActivityLog = require('./models/ActivityLog');
const Milestone = require('./models/Milestone');
const ParentStudentLink = require('./models/ParentStudentLink');
const Alert = require('./models/Alert');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('SERVER FATAL: MONGODB_URI NOT CONFIGURED');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('SYSTEM HUB: CONNECTED TO NEURAL DATABASE (MONGODB ATLAS)'))
  .catch(err => console.error('SYSTEM HUB: DATABASE CONNECTION PROTOCOL FAILED', err));

const checkConnection = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('DATABASE_NOT_CONNECTED: Please ensure MongoDB is reachable and IP is whitelisted.');
  }
};

const db = {
  users: {
    find: async (query = {}) => { checkConnection(); return await User.find(query); },
    findOne: async (query = {}) => { checkConnection(); return await User.findOne(query); },
    findById: async (id) => { checkConnection(); return await User.findById(id); },
    insert: async (user) => {
      checkConnection();
      const newUser = new User(user);
      return await newUser.save();
    },
    update: async (id, updates) => { checkConnection(); return await User.findByIdAndUpdate(id, updates, { new: true }); }
  },
  logs: {
    find: async (query = {}) => {
      let mQuery = { ...query };
      // Handle special query operators if any were used in JSON
      if (query.userId && query.userId.$in) {
        mQuery.userId = { $in: query.userId.$in };
      }
      if (query.timestamp) {
        mQuery.timestamp = {};
        if (query.timestamp.$gte) mQuery.timestamp.$gte = new Date(query.timestamp.$gte);
        if (query.timestamp.$lte) mQuery.timestamp.$lte = new Date(query.timestamp.$lte);
      }
      return await ActivityLog.find(mQuery).sort({ timestamp: -1 });
    },
    insert: async (log) => {
      const newLog = new ActivityLog(log);
      if (!newLog._id) newLog._id = 'log_' + Math.random().toString(36).substr(2, 9);
      return await newLog.save();
    }
  },
  tasks: {
    find: async (query = {}) => await Task.find(query),
    insert: async (task) => {
      const newTask = new Task(task);
      return await newTask.save();
    },
    upsert: async (match, task) => {
      return await Task.findOneAndUpdate(match, task, { upsert: true, new: true });
    }
  },
  milestones: {
    find: async (query = {}) => {
       // Support both childId and studentId (legacy check)
       const q = { ...query };
       if (q.childId) {
         q.studentId = q.childId;
         delete q.childId;
       }
       return await Milestone.find(q);
    },
    insert: async (milestone) => {
      const newMilestone = new Milestone(milestone);
      return await newMilestone.save();
    },
    update: async (id, updates) => await Milestone.findByIdAndUpdate(id, updates, { new: true })
  },
  parent_student_links: {
    find: async (query = {}) => await ParentStudentLink.find(query),
    findOne: async (query = {}) => await ParentStudentLink.findOne(query),
    insert: async (link) => {
      const newLink = new ParentStudentLink(link);
      return await newLink.save();
    },
    update: async (id, updates) => await ParentStudentLink.findByIdAndUpdate(id, updates, { new: true })
  },
  alerts: {
    find: async (query = {}) => await Alert.find(query),
    insert: async (alert) => {
      const newAlert = new Alert(alert);
      return await newAlert.save();
    },
    update: async (id, updates) => await Alert.findByIdAndUpdate(id, updates, { new: true })
  }
};

module.exports = db;
