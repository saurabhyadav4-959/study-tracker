const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'system_hub_db.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Ensure database file exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ 
    users: [], 
    logs: [], 
    tasks: [], 
    milestones: [],
    parent_student_links: [] 
  }, null, 2));
}

const getData = () => {
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  if (!data.parent_student_links) data.parent_student_links = [];
  return data;
};
const saveData = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

const db = {
  // ... existing users, logs, tasks, milestones ...
  parent_student_links: {
    find: (query = {}) => {
      const { parent_student_links } = getData();
      return parent_student_links.filter(l => Object.keys(query).every(k => l[k] === query[k]));
    },
    insert: (link) => {
      const data = getData();
      const newLink = { ...link, _id: `link_${Math.random().toString(36).substr(2, 9)}`, createdAt: new Date().toISOString() };
      data.parent_student_links.push(newLink);
      saveData(data);
      return newLink;
    }
  },
  users: {
    find: (query = {}) => {
      const { users } = getData();
      return users.filter(u => Object.keys(query).every(k => u[k] === query[k]));
    },
    findOne: (query = {}) => {
      const { users } = getData();
      return users.find(u => Object.keys(query).every(k => u[k] === query[k]));
    },
    findById: (id) => {
      const { users } = getData();
      return users.find(u => u._id === id || u.id === id);
    },
    insert: (user) => {
      const data = getData();
      // Default to 'pending' to force post-login selection
      const newUser = { ...user, role: user.role || 'pending', _id: `node_${Math.random().toString(36).substr(2, 9)}`, createdAt: new Date().toISOString() };
      data.users.push(newUser);
      saveData(data);
      return newUser;
    },
    update: (id, updates) => {
      const data = getData();
      const index = data.users.findIndex(u => u._id === id || u.id === id);
      if (index !== -1) {
        data.users[index] = { ...data.users[index], ...updates };
        saveData(data);
        return data.users[index];
      }
    }
  },
  logs: {
    find: (query = {}) => {
      const { logs } = getData();
      return logs.filter(l => {
        return Object.keys(query).every(k => {
          if (k === 'userId' && query[k].$in) return query[k].$in.includes(l.userId);
          if (k === 'timestamp') {
             if (query[k].$gte && new Date(l.timestamp) < new Date(query[k].$gte)) return false;
             if (query[k].$lte && new Date(l.timestamp) > new Date(query[k].$lte)) return false;
             return true;
          }
          return l[k] === query[k];
        });
      }).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    },
    insert: (log) => {
      const data = getData();
      const newLog = { ...log, _id: `log_${Math.random().toString(36).substr(2, 9)}`, timestamp: new Date().toISOString() };
      data.logs.push(newLog);
      saveData(data);
      return newLog;
    }
  },
  tasks: {
    find: (query = {}) => {
      const { tasks } = getData();
      return tasks.filter(t => Object.keys(query).every(k => t[k] === query[k]));
    },
    upsert: (match, task) => {
      const data = getData();
      const index = data.tasks.findIndex(t => Object.keys(match).every(k => t[k] === match[k]));
      if (index !== -1) {
        data.tasks[index] = { ...data.tasks[index], ...task };
      } else {
        data.tasks.push({ ...task, _id: `task_${Math.random().toString(36).substr(2, 9)}`, createdAt: new Date().toISOString() });
      }
      saveData(data);
    },
    insert: (task) => {
      const data = getData();
      const newTask = { ...task, _id: `task_${Math.random().toString(36).substr(2, 9)}`, createdAt: new Date().toISOString() };
      data.tasks.push(newTask);
      saveData(data);
      return newTask;
    }
  },
  milestones: {
    find: (query = {}) => {
      const { milestones } = getData();
      return milestones.filter(m => Object.keys(query).every(k => m[k] === query[k]));
    },
    insert: (milestone) => {
      const data = getData();
      const newMilestone = { ...milestone, _id: `goal_${Math.random().toString(36).substr(2, 9)}`, createdAt: new Date().toISOString() };
      data.milestones.push(newMilestone);
      saveData(data);
      return newMilestone;
    },
    update: (id, updates) => {
      const data = getData();
      const index = data.milestones.findIndex(m => m._id === id);
      if (index !== -1) {
        data.milestones[index] = { ...data.milestones[index], ...updates };
        saveData(data);
        return data.milestones[index];
      }
    }
  }
};

module.exports = db;
