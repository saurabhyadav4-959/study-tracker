const db = require('./db_adapter');
const bcrypt = require('bcryptjs');

const testEmail = '23456@gmail.com';
const testPassword = '123'; // I'll guess common passwords or just check if compare works

async function runTest() {
  try {
    const user = await db.users.findOne({ email: testEmail });
    console.log('User found:', user ? user.name : 'NO');

    if (user) {
      const isMatch = await bcrypt.compare('12345', user.password); // Try matching the name as password
      console.log('Password match (12345):', isMatch);
      
      const isMatch2 = await bcrypt.compare('23456', user.password); 
      console.log('Password match (23456):', isMatch2);
    }
  } catch (err) {
    console.error('Test failed:', err.message);
  } finally {
    process.exit(0);
  }
}

runTest();
