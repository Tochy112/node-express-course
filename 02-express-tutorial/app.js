const express = require('express')
const app = express()

const {products} = require('./data')

app.get('/', (req, res) => {
    res.send('<h1>Homa page </h1> <a href="/api/products">Products</a>')
})

app.get('/api/products', (req, res) => {
    const newProducts = products.map((product) => {
        const {id, name, image} = product
        return {id, name, image}
    })
    res.json(newProducts)
})

//route parameters
//req.params
app.get(`/api/products/:productID`, (req, res) => { 
    // console.log(req.params)
    const {productID} = req.params
    const singleProduct = products.find((product) => product.id === Number(productID))
    
    if(!singleProduct){
        return res.status(404).send('<h2 style="color: red"> Invalid parameter </h2>')
     }
    
     res.json(singleProduct)
   
})

// more complex params
app.get('/api/products/:productID/reviews/:reviewID', (req, res) => {
    console.log(req.params);
    res.send('Hello world') 
})


//======= query parameters =======//

app.get('/api/v1/query', (req, res) => {
    // console.log(req.query);
    const {search, limit} = req.query
    let sortedProducts = [...products]
    if (search) {
        sortedProducts = sortedProducts.filter((product) => {
           return product.name.startsWith(search)
        })
    }
    if (limit) {
        sortedProducts = sortedProducts.slice(0, Number(limit))
    }

    res.status(200).json(sortedProducts)
    // res.send('Hello world') 

})

app.listen(5000, () => {
    console.log('server listening at port 5000...');
})