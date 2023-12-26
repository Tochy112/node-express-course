const express = require('express')
const router = express.Router()
const {
    getPeople, 
    createPerson, 
    updatePerson, 
    deletePerson
} = require('../controllers/people')

// router.get('/', getPeople)

// router.post('/', createPerson)

// router.patch('/:id', updatePerson)

// router.delete('/:id', deletePerson)

router.route('/')
.get(getPeople)
.post(createPerson)

router.route('/:id')
.patch(updatePerson)
.delete(deletePerson)

module.exports = router
