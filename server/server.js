const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

console.log('--- SYSTEM HUB CORE ---');
console.log('STATUS: RUNNING');
console.log('DATABASE: LOCAL_RESILIENCE_MODE (JSON)');
console.log('-----------------------');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/parent', require('./routes/parent'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/tasks', require('./routes/tasks'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SYSTEM HUB SERVER INITIALIZED ON PORT ${PORT}`));
