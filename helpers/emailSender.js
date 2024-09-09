const nodemailer  = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: '',
    port: 7537,
    secure: false, // For TLS
    auth: {
        user: '',
        pass: '',
    },
});

// Wrappers Email template for some forms
async function sendMail(to, subject, text) {
    const mailOptions = {
        name: '',
        from: '',
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