const bcrypt = require('bcryptjs');

async function test() {
  try {
    const salt = await bcrypt.genSalt(10);
    console.log('Salt generated');
    const hash = await bcrypt.hash('password', salt);
    console.log('Hash generated');
    const match = await bcrypt.compare('password', hash);
    console.log('Match:', match);
  } catch (err) {
    console.error('BCRYPT ERROR:', err);
  }
}

test();
