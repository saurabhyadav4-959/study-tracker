const bcrypt = require('bcryptjs');

async function test() {
  const hash = '$2b$10$fWi7Di.rbHHrpzIlyzdtg.OqjXo/8H3E.udoEvkYsHO9gL6luRz36';
  const password = 'password'; // Doesn't matter, just testing if it throws
  try {
    const isMatch = await bcrypt.compare(password, hash);
    console.log('bcrypt.compare works. Result:', isMatch);
  } catch (err) {
    console.error('bcrypt.compare failed:', err);
  }
}

test();
