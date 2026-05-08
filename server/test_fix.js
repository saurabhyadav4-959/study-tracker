const db = require('./db_adapter');

const testEmail = 'STUDENT11@GMAIL.COM';
const normalizedEmail = testEmail.toLowerCase();

async function runTest() {
  try {
    console.log('Searching for:', normalizedEmail);
    const user = await db.users.findOne({ email: normalizedEmail });

    if (user) {
      console.log('SUCCESS: User found!', user.name);
    } else {
      console.log('FAILED: User not found.');
    }
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    process.exit(0);
  }
}

runTest();
