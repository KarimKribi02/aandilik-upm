const mysql = require('mysql2/promise');

async function setMaxPacket() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aandilik',
  });

  try {
    console.log('Fetching current max_allowed_packet...');
    const [rows1] = await connection.execute("SHOW VARIABLES LIKE 'max_allowed_packet'");
    console.log('Current:', rows1[0]);

    console.log('Setting GLOBAL max_allowed_packet to 64MB...');
    await connection.execute('SET GLOBAL max_allowed_packet = 67108864');
    
    const [rows2] = await connection.execute("SHOW VARIABLES LIKE 'max_allowed_packet'");
    console.log('New:', rows2[0]);

    console.log('Packet limit increased successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

setMaxPacket();
