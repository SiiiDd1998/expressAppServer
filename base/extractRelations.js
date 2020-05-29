const express = require('express')
const router = express.Router()
const graph = require('./getRecord')

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

function getNormalizedScore() {
    //compute average of all list elements for a company

    for (organisation in companyScores) {
        //if value is array, compute average of the array. This gives normalized score for that company
        if(companyScores[organisation].length)
            companyScores[organisation] = average(companyScores[organisation])
    }
}

function normalizeScore (params) {
    // function to compute normalized score of all organisations

    return new Promise ((resolve, reject) => {
        graph.getRelations(params)
        .then(relations => {
            
            //add all relations to companyScores
            addToList(relations, params.sentiment);
            console.log('length after: ', Object.keys(companyScores).length)
            resolve('done');
        })
        .catch(err => console.log(err));  
    }); 
}

// The main thing to be used
function extractRelations({ Params }) {

    // console.log("Params are\n", Params);
    
    var getVolatilityPromises = []
    var normalizeScorePromises = []
    var sentiments = {}
    // compute main node score if it is an organisation
    for (param of Params) {
        sentiments[param.symbol] = param.sentiment;

        normalizeScorePromises.push(normalizeScore(param));
        getVolatilityPromises.push(graph.getNodeVolatility(param));
    }
    // console.log('array has\n', normalizeScorePromises);

    return Promise.all(getVolatilityPromises)
     .then(results => {
        for(result of results) {
            //  console.log("result fields\n", result._fields);
             
            if(result._fields) {
                parentName = result._fields[0].end.properties.name
                sentiment = sentiments[parentName]
                volatility = parseFloat(result._fields[0].segments[0].relationship.properties.value);
                companyScores[parentName] = parseFloat(sentiment)*volatility;
                console.log(parentName, companyScores[parentName]);
                
            }
        }
        return Promise.all(normalizeScorePromises)
     }).then(values => {
        getNormalizedScore();
        return companyScores;
     })
     .catch(error => console.log(error));

}

/* compute = extractRelations({
    Params: [
        {
            label: 'Organisation',
            symbol: "IFCI.NS",
            sentiment: 0.8
        },
        {
            label: 'Commodity',
            symbol: "Steel",
            sentiment: 0.9
        },
        //so on companies
    ]
}); */

/* console.log('compute\n', compute);
compute.then(val => {
    console.log('val\n', val);
    
}) */


module.exports = extractRelations;