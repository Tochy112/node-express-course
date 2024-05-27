const nodemailer = require("nodemailer");

const sendEmail = async( req, res) => {
    const account = await nodemailer.createTestAccount() 

    //using gmail service
    const transporter = nodemailer.createTransport({
        // host: process.env.EMAIL_HOST,
        service: "gmail",
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });


    const info = await transporter.sendMail({
        from: '"Tochy 👻" <ukwuomatochi112@gmail.com>', // sender address
        to: "ukwuomatochi123@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        html: "<b>Sending email with Nodejs</b>", // html body
        template: ""
      });

      console.log(transporter);
    res.json(info)
    
}

module.exports = sendEmail