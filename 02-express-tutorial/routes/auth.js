const express = require('express')
const router = express.Router()


router.post('/', (req, res) => {
    const {name} = req.body
    if (name) {
        return res.status(200).json({success: true, JWT: " nbubsjkui30bbi"})
    }
    res.status(401).send('pls provide credentails')
})

module.exports = router