const nodemailer  = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    secure: false, // For TLS
    auth: {
        user: 'AKIAJD3QTDB3RJRCPHVA',
        pass: 'AgiKna4VPa6osLcpJzW6R/Ge0qcM3RSEck0L/uTH6zaF',
    },
});

// Wrappers Email template for some forms
async function sendMail(to, subject, text) {
    const mailOptions = {
        name: 'ChatterNet',
        from: 'intexfair@worldexindia.com',
        to,
        subject,
        text,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = { sendMail }