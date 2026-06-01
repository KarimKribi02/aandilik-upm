const nodemailer = require('nodemailer');
require('dotenv').config();

async function testMail() {
    console.log('Testing SMTP with:', process.env.MAIL_USER);
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'ahlanbekgroup@gmail.com',
            pass: 'kubl fcel kfur nobd',
        },
    });

    try {
        const info = await transporter.sendMail({
            from: '"AANDILIK TEST" <ahlanbekgroup@gmail.com>',
            to: 'simohmdsawi22@gmail.com',
            subject: 'Test de connexion AANDILIK',
            text: 'Si vous recevez cet email, la configuration SMTP est fonctionnelle.',
            html: '<b>Si vous recevez cet email, la configuration SMTP est fonctionnelle.</b>',
        });
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ SMTP Error:', error.message);
    }
}

testMail();
