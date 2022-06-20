const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');


const mailConfig = async (data, link) => {

    // config for admin
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, // admin gmail id
            pass: process.env.EMAIL_PASSWORD, // admin gmail password
        },
    });


    // config for end user
    const info = await transporter.sendMail({
        from: process.env.EMAIL_SENDER,                // sender address
        to: data.email,                             // list of receivers
        subject: "Library Management - Password Reset Link",            // Subject line
        html: `<a href=${link}>Click Here</a> to Reset Your Password`, // html body
    });

    return info
};


module.exports = mailConfig;