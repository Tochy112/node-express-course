const express = require('express')
const path = require('path')

const app = express()

// setup static and middleware
app.use(express.static('./public'))

// app.get('/', (req, res) => {
//     res.sendFile(path.resolve(__dirname, './navbar-app/index.html')) //accessing the path
// })

// 404 routing
app.all('*', (req, res) => {
    res.status(400).send('<h2> Resource not found </h2>')
})

app.listen(3000, () => {
    console.log('listening on port 3000');
})




