const mysql = require('mysql2/promise');

async function check() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aandilik',
  });

  try {
    const [rows] = await connection.execute('SELECT id, email, nom, role FROM users');
    console.log('Users in database:');
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error('Error fetching users:', err.message);
  } finally {
    await connection.end();
  }
}

check();
