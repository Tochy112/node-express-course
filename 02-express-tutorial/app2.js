const express = require('express')
const app = express()
let {people} = require('./data')
const peopleRouter = require('./routes/people')
const authRouter = require('./routes/auth')

//accessing the static pages
app.use(express.static('./methods-public'))

//middleware for forms
app.use(express.urlencoded({extended: false}))

//middleware to allow express send json data
app.use(express.json())

//routers
app.use('/api/people', peopleRouter)
app.use('/login', authRouter)


app.post('/api/admin/orders', (req, res) => {
    const {type, asset, rate} = req.body

    if (!type && !asset && !rate) {
        res.status(400).json({success: false, msg:'please provide the details'})
    }
    res.status(201).json({success: true, order: {type, asset, rate} })
})


app.listen(5000, () => {
    console.log('app listening at port 5000');
})