const mysql = require('mysql2/promise');

async function checkSchema() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aandilik',
  });

  try {
    const [rows] = await connection.execute('DESCRIBE articles;');
    console.log('Articles table schema:', rows);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkSchema();
