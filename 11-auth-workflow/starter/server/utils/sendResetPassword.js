const sendEmail = require("./sendEmail")

const sendResetPasswordEmail = async ({name, email, token, origin}) => {
    // url to a page on the frontend
    //origin here represents the base url
    const resetPasswordUrl = `${origin}/user/reset-password?token=${token}&email=${email}`
    const message = `<p> Please reset password by clicking on the following link : 
  <a href="${resetPasswordUrl}">Reset password</a> </p>`;
    
    return sendEmail({
        to: email, 
        subject: "Password Reset", 
        html:`<h4>Hello ${name}</h4> ${message}` 
    })
}

module.exports = sendResetPasswordEmail