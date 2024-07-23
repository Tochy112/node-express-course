const crypto = require("crypto")

const CreateHash = (string) => crypto.createHash("md5").update(string).digest("hex")

module.exports =  CreateHash