// Import model
const Assembly = require("../models/assembly.model");
const mongoose = require('mongoose');
const Teammate = mongoose.model('Teammate');

// Export functions to be called in Routes
module.exports = {
    // CREATE: Create one Assembly
    create(req, res) {
        Assembly.create(req.body)
            .then(Assembly => res.json(Assembly))
            .catch(err => res.status(400).json(err));
    },

    // READ: Get all Assemblies
    getAll(req, res) {
        // Blank .find param gets all
        Assembly.find({})
            .then(Assemblies => res.json(Assemblies))
            .catch(err => res.status(400).json(err))
    },
    // READ: Get one Assembly by id
    getOne(req, res) {
        Assembly.findById({ _id: req.params.id })
            .then(Assembly => res.json(Assembly))
            .catch(err => res.status(400).json(err))
    },

    // UPDATE: Update one Assembly by id, re-running validators on any changed fields
    update(req, res) {
        Assembly.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true
        })
            .then(updatedAssembly => res.json(updatedAssembly))
            .catch(err => res.status(400).json(err));
    },

    // Add a teammate to .team
    addTeammate(req, res) {
        Assembly.findById({ _id: req.params.id })
            .then((assembly) => {
                // create teammate
                let newTeammate = new Teammate(req.body); 
                // push teammate
                assembly.team.push(newTeammate);         
                // save teammate
                assembly.save()                           
                    .then((data) => {
                        res.json(data);
                    })
                    .catch((err) => {
                        res.status(400).json(err);
                    })
            })
            .catch(err => res.status(400).json(err))
    },

    // DESTROY: Delete one Assembly by id
    delete(req, res) {
        Assembly.findByIdAndDelete(req.params.id)
            .then(deletedAssembly => res.json(deletedAssembly))
            .catch(err => res.status(400).json(err));
    },
};