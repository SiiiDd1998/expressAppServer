const express = require('express');
const router = express.Router();
const axios = require('axios')

const CognitiveSearchCredentials = require('ms-rest-azure').CognitiveServicesCredentials
const credentials = new CognitiveSearchCredentials('8034b0c772da48dcbb924e0b72254e03')
const searchTerm = 'cnbc.com news'

const NewsSearchAPIClient = require('azure-cognitiveservices-newssearch');
let client = new NewsSearchAPIClient(credentials);

/* GET users listing. */
router.get('/', (req, res, next) => {

    client.newsOperations.search(searchTerm,{market: 'en-in'}).then((result) => {
        axios.post('https://flask-app-investor-buddy.azurewebsites.net/extract-relation', result.value)
        .then(function (response) {
            console.log(response);
        })
        return res.json(result.value)
    }).catch((err) => {
        return res.send(400).send({
            error: err
        })
    });
})

module.exports = router;