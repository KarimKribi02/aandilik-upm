const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function testPasswords() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aandilik',
  });

  try {
    const [users] = await connection.execute('SELECT * FROM users;');
    console.log('Seeded users in DB:', users.map(u => ({ id: u.id, email: u.email, role: u.role, passwordHash: u.password })));

    for (const user of users) {
      let testPass = '';
      if (user.email === 'admin@aandilik.com') {
        testPass = 'AdminPass123!';
      } else if (user.email === 'partner@aandilik.com') {
        testPass = 'PartnerPass123!';
      }

      if (testPass) {
        const isMatch = await bcrypt.compare(testPass, user.password);
        console.log(`Testing password for ${user.email} (should match "${testPass}"):`, isMatch);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

testPasswords();
