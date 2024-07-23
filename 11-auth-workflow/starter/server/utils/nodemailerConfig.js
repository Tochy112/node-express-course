//using gmail service
module.exports = {
    // host: process.env.EMAIL_HOST,
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
}