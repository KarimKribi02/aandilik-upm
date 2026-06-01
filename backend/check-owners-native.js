const http = require('http');

http.get('http://localhost:3001/materiel', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const equipment = JSON.parse(data);
            console.log('--- Ownership Check ---');
            equipment.forEach(item => {
                console.log(`EID: ${item.id} | NAME: ${item.nom_equipement} | OWNER: ${item.proprietaire?.email} (UID: ${item.proprietaire?.id})`);
            });
        } catch (e) {
            console.error('Failed to parse JSON');
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
