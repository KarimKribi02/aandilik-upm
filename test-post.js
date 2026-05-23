const http = require('http');

const data = JSON.stringify({
  title: 'Test',
  content: 'Test content',
  category: 'CONSEILS'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/blog',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
