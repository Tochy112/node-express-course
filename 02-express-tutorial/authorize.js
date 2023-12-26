const authorize = ((req, res, next) => {
    const {user} = req.query

    if (user === 'john') {
        req.user = {name: 'john', id: 3}
        next()
    }
    res.status(401).send('unauthorized')
})

module.exports = authorize