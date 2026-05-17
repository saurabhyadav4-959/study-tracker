const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins for this prototype; restrict in production later if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const db = require('./db_adapter');

console.log('--- SYSTEM HUB CORE ---');
console.log('STATUS: RUNNING');
console.log('DATABASE: NEURAL_DATABASE (MONGODB_ATLAS)');
console.log('-----------------------');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/parent', require('./routes/parent'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/milestones', require('./routes/milestones'));

app.get('/api/health', (req, res) => {
  const status = db.users ? 'ACTIVE' : 'DISCONNECTED';
  const dbStatus = require('mongoose').connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  res.json({ 
    server: 'ONLINE', 
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
// Global Error Handler
app.use((err, req, res, next) => {
  console.error('SERVER_ERROR:', err);
  res.status(500).json({ message: 'INTERNAL_SERVER_ERROR', error: err.message });
});

app.listen(PORT, () => console.log(`SYSTEM HUB SERVER INITIALIZED ON PORT ${PORT}`));
