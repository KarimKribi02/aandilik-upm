const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function fix() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aandilik',
  });

  try {
    const userDetails = {
      'admin@aandilik.com': { pass: 'AdminPass123!', nom: 'Super Admin' },
      'owner@aandilik.com': { pass: 'password123', nom: 'Fleet Owner' },
      'hassan22@gmail.com': { pass: 'password123', nom: 'Hassan' }
    };

    for (const [email, details] of Object.entries(userDetails)) {
      const hashed = await bcrypt.hash(details.pass, 10);
      console.log(`Updating ${email} password and name...`);
      await connection.execute('UPDATE users SET password = ?, nom = ? WHERE email = ?', [hashed, details.nom, email]);
    }
    
    console.log('Done.');
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

fix();
