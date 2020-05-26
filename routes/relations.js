const express = require('express')
const router = express.Router()
const graph = require('../base/getRecord')

var companyScores = {}

function average(arr) {
    var sum = 0;
    for(let i=0;i<arr.length ;i++) {
        sum += arr[i];
    }
    return sum/arr.length;

}

function addToList(relations, sentiment) {
    for(relation of relations) {
        //get related organisation name
        organisation = relation._fields[0].end.properties.name;

        //calculated related organisation score using correlation/beta, and sentiment
        multiplier = parseFloat(relation._fields[0].segments[0].relationship.properties.value);
        score = sentiment*multiplier;

        //If sentiment is extract directly from news, no need to find correlations 
        if(typeof companyScores[organisation] !== 'number')
            companyScores[organisation] = organisation in companyScores ? companyScores[organisation].push(score) : [score];
    }
}

function normalizeScore() {
    //compute average of all list elements for a company

    for (organisation in companyScores) {
        //if value is array, compute average of the array. This gives normalized score for that company
        if(companyScores[organisation].length)
            companyScores[organisation] = average(companyScores[organisation])
    }
}

function getNormalizedScore (params) {
    // function to compute normalized score of all organisations

    return new Promise ((resolve, reject) => {
        graph.getRelations(params)
        .then(relations => {
            
            //add all relations to companyScores
            addToList(relations, params.sentiment);

            //Get normalized score of all relations
            normalizeScore();
    
            resolve(companyScores);
        })
        .catch(err => console.log(err));
        
    }); 

}

router.get('/', function(req, res, next) {
    // Choose any one params for test use
    // params = {
    //     label: 'Organisation',
    //     symbol: "IFCI.NS",
    //     sentiment: 0.8
    // }

    params = {
        label: 'Commodity',
        symbol: "Steel",
        sentiment: 0.8
    }
    
    graph.getRelations(params)
        .then(relations => {
    
            console.log(relations[0]);
            res.json(relations);
        })
        .catch(err => console.log(err));
});

router.get('/scores', function (req, res, next) {
    // Choose any one params for test use
    params = {
        label: 'Organisation',
        symbol: "IFCI.NS",
        sentiment: 0.8
    }

    // params = {
    //     label: 'Commodity',
    //     symbol: "Steel",
    //     sentiment: 0.8
    // }

    // compute main node score if it is an organisation
    graph.getNodeVolatility(params)
        .then(result => {
            if(result._fields) {
                volatility = parseFloat(relation._fields[0].segments[0].relationship.properties.value);
                companyScores[params.symbol] = parseFloat(params.sentiment)*volatility;
            }
            // compute normalized score
            getNormalizedScore(params)
            .then(result => {
                // console.log(result['CUB.NS'])
                res.json(result)
            });
        });
});

router.get('/parent', function(req, res) {

        graph.getRelations('IFCI.NS')
        .then(parent => {
            console.log(parent[0]);
            res.json(parent)
        }); 
})

module.exports = router;