const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function resetAndVerify() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aandilik',
  });

  try {
    const email = 'owner@aandilik.com';
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log(`Resetting password for ${email}...`);
    
    // Check if user exists first
    const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      console.log(`User ${email} does not exist. Creating...`);
      await connection.execute(
        "INSERT INTO users (email, password, role, nom) VALUES (?, ?, 'propriétaire', 'Test Owner')",
        [email, hashedPassword]
      );
      console.log('User created.');
    } else {
      await connection.execute(
        'UPDATE users SET password = ?, role = ? WHERE email = ?',
        [hashedPassword, 'propriétaire', email]
      );
      console.log('Password and role updated.');
    }

    const [allUsers] = await connection.execute('SELECT id, email, role FROM users;');
    console.log('Current users:', allUsers);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

resetAndVerify();
