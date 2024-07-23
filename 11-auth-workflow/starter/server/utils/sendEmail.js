const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig")

const sendEmail = async({to, subject, html}) => {
    const transporter = nodemailer.createTransport(nodemailerConfig);

    const info = await transporter.sendMail({
        from: '"Tochy" <ukwuomatochi112@gmail.com>', // sender address
        to: to,
        subject: subject,
        html: html,
        template: ""
      });
    
    return info  
}

module.exports = sendEmail