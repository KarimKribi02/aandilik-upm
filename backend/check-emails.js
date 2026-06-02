const { DataSource } = require('typeorm');

async function check() {
  const ds = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'aandilik',
  });

  await ds.initialize();
  const res = await ds.query('SELECT id, client_nom, client_email, statut FROM reservations');
  console.log('--- Current Reservations in DB ---');
  console.table(res);
  await ds.destroy();
}

check();
