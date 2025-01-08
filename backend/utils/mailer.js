const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'raataitech@gmail.com',
        pass: 'eayf paxv nmar yjql',
    }
});

async function sendEmail(to, subject, text, html) {
    const mailOptions = {
        from: 'raataitech@gmail.com',
        to: to,
        subject: subject,
        text: text, 
        html: html
    };

    try {
        // Send mail with defined transport object
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return 'Email sent successfully';
    } catch (error) {
        console.error(error);
        throw new Error('Error sending email');
    }
}

module.exports = sendEmail;

