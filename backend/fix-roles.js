const mysql = require('mysql2/promise');

async function fixRoles() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aandilik',
  });

  try {
    console.log('Fixing user roles...');
    
    // Set role to 'propriétaire' for users with empty role or 'Owner' matching ones
    const [result] = await connection.execute(
      "UPDATE users SET role = 'propriétaire' WHERE role = '' OR role IS NULL OR email LIKE 'owner%';"
    );
    
    console.log(`Updated ${result.affectedRows} users.`);
    
    const [users] = await connection.execute('SELECT id, email, role FROM users;');
    console.log('Current users and roles:', users);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

fixRoles();
