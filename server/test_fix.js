const db = require('./db_adapter');

const testEmail = 'STUDENT11@GMAIL.COM';
const normalizedEmail = testEmail.toLowerCase();

console.log('Searching for:', normalizedEmail);
const user = db.users.findOne({ email: normalizedEmail });

if (user) {
  console.log('SUCCESS: User found!', user.name);
} else {
  console.log('FAILED: User not found.');
}
