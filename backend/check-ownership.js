const axios = require('axios');

async function checkOwnership() {
    try {
        const response = await axios.get('http://localhost:3001/materiel');
        const equipment = response.data;
        
        console.log('--- Equipment Ownership Report ---');
        equipment.forEach(item => {
            console.log(`ID: ${item.id} | Name: ${item.nom_equipement} | Owner: ${item.proprietaire?.email} (${item.proprietaire?.id})`);
        });
    } catch (error) {
        console.error('Error fetching equipment:', error.message);
    }
}

checkOwnership();
