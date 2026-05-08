const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Attempting to connect to:', MONGODB_URI ? MONGODB_URI.split('@')[1] : 'UNDEFINED');

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout
})
  .then(async () => {
    console.log('SUCCESS: Connected to MongoDB');
    process.exit(0);
  })
  .catch(err => {
    console.error('ERROR: Connection failed!');
    console.error('Reason:', err.message);
    if (err.message.includes('ETIMEDOUT') || err.message.includes('Could not connect to any servers')) {
      console.log('\n' + '='.repeat(50));
      console.log('CRITICAL: IP WHITELIST ERROR DETECTED');
      console.log('='.repeat(50));
      console.log('1. Go to MongoDB Atlas: https://cloud.mongodb.com/');
      console.log('2. Click on "Network Access" in the left sidebar.');
      console.log('3. Click "Add IP Address".');
      console.log('4. Click "Add Current IP Address" or "Allow Access from Anywhere" (0.0.0.0/0).');
      console.log('5. Wait 1 minute for changes to deploy, then try again.');
      console.log('='.repeat(50) + '\n');
    }
    process.exit(1);
  });
