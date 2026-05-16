

const nodemailer = require('nodemailer');

const transpotter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
})

const mailOptions = (options) => {
    return {
        from: `${process.env.EMAIL_ADDRESS}`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    }
};

const sendMail = async (options) => {
    try {
        await transpotter.sendMail(mailOptions(options));
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendMail;