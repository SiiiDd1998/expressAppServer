const express = require('express');
const router = express.Router();
const axios = require('axios');
const RelationExtractor = require('../base/extractRelations')

const CognitiveSearchCredentials = require('ms-rest-azure').CognitiveServicesCredentials
const credentials = new CognitiveSearchCredentials('dba8ba5143ea4a40bf75e82fc854fc6f') //8034b0c772da48dcbb924e0b72254e03
const searchTerm = 'moneycontrol.com news'

const NewsSearchAPIClient = require('azure-cognitiveservices-newssearch');
let client = new NewsSearchAPIClient(credentials); //https://news-extractor-api.cognitiveservices.azure.com/bing/v7.0

/* GET users listing. */
router.get('/', (req, res, next) => {

    client.newsOperations.search(searchTerm, { market: 'en-in' })
        .then((result) => {
            // console.log(result);
            // res.json({news: result.value});
            axios.post('https://flask-app-investor-buddy.azurewebsites.net/extract-relations', {
                news: result.value
            })
                .then((response) => {
                    // console.log(response.data);
                    var Params = RelationExtractor.convertToParams(response.data);
                    console.log(Params);
                    
                    return RelationExtractor.extractRelations({ Params })
                    
                    // return res.json(response.data)
                })
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    return res.status(400).send({
                        error: "Idhar error hai bhoi"
                    })
                });
        }).catch((err) => {
            console.log(err);

            return res.status(400).send({
                error: "Idhar error hai selmon"
            });
        });
})

module.exports = router;