const mysql = require('mysql2/promise');

async function dropTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aandilik',
  });

  try {
    console.log('Dropping articles table...');
    await connection.execute('DROP TABLE IF EXISTS articles;');
    console.log('Dropping partners table...');
    await connection.execute('DROP TABLE IF EXISTS partners;');
    console.log('Tables dropped successfully.');
  } catch (error) {
    console.error('Error dropping tables:', error);
  } finally {
    await connection.end();
  }
}

dropTables();
