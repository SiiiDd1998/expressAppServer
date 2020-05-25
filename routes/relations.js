const express = require('express')
const router = express.Router()
const getRelations = require('../Tp')

router.get('/', function(req, res, next) {
    getRelations()
        .then(relations => {
            console.log(relations[0]);
            res.json(relations);
        })
        .catch(err => console.log(err));
});

module.exports = router;