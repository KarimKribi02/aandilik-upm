const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function check() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aandilik',
  });

  try {
    const [rows] = await connection.execute('SELECT email, password FROM users WHERE email = ?', ['admin@aandilik.com']);
    if (rows.length > 0) {
      const user = rows[0];
      const match = await bcrypt.compare('AdminPass123!', user.password);
      console.log('Admin password check:');
      console.log('Email:', user.email);
      console.log('Stored Hash:', user.password);
      console.log('Match with "AdminPass123!":', match);
    } else {
      console.log('Admin user not found');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await connection.end();
  }
}

check();
