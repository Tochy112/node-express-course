const {people} = require('../data')

const getPeople = (req, res) => {
    res.status(200).json({success: true, data: people})
}

const createPerson = (req, res) => {
    const {name} = req.body
    if (!name) {
        res.status(400).json({success:false, msg: 'please provide name value'})
    }
    res.status(201).json({success: true, data: [...people, name]})
}

const updatePerson = (req, res) => {
    const {id} = req.params
    const {name} = req.body

    const updatedPerson = people.find((person) => person.id === Number(id))

    if (!updatedPerson) {
        res.status(404).json({success:false, msg: ` id ${id} not found`})
    }

    const newPeople = people.map((people) => {
        if (people.id === Number(id)) {
           people.name = name 
        }
        return people
    })
    console.log(newPeople);
    res.status(200).json({success: true, data: newPeople})
}

const deletePerson = (req, res) => {
    const {id} = req.params
    
    const deletedPerson = people.find((person) => person.id === Number(id))
    
    if (!deletedPerson) {
        res.status(404).json({success: false, msg: "data not found"})
    }

    const modifiedData = people.filter((person) => {
        return person.id !== Number(id)
    })

    res.status(200).json({success: true, data: modifiedData})

}

module.exports = {
    getPeople, 
    createPerson, 
    updatePerson, 
    deletePerson
}