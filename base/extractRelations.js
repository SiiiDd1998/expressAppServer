const graph = require('./getRecord')
const average = require('./util')

var companyScores = {}
var newsRelations = {}

var relations = {}

function addToList(relations, sentiment, news) {
    for(relation of relations) {
        //get related organisation name
        organisation = relation._fields[0].end.properties.name;

        //add news source for organisation
        if(organisation in newsRelations) {
            for(url of news) {
                if(newsRelations[organisation].indexOf(url) == -1) {
                    newsRelations[organisation].push(url);
                }
            }
        }
        else {
            newsRelations[organisation] = news;
            // console.log('news is ', newsRelations[organisation]);
        }

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

function getFinalScores() {
    var finalScores = []
    for(organisation in companyScores) {
        finalScores.push({
            symbol: organisation,
            sentiment: companyScores[organisation],
            news: newsRelations[organisation]
        });
    }
    return { finalScores }
}

function normalizeScore (params) {
    // function to compute normalized score of all organisations

    return new Promise ((resolve, reject) => {
        graph.getRelations(params)
        .then(relations => {
            
            //add all relations to companyScores
            addToList(relations, params.sentiment, params.news);
            console.log('length after: ', Object.keys(companyScores).length)
            resolve('done');
        })
        .catch(err => console.log(err));  
    }); 
}

// The main thing to be used
relations.extractRelations = function ({ Params }) {

    // console.log("Params are\n", Params);
    
    var getVolatilityPromises = []
    var normalizeScorePromises = []
    var sentiments = {}
    // compute main node score if it is an organisation
    for (param of Params) {
        sentiments[param.symbol] = param.sentiment;
        newsRelations[param.symbol] = param.news
        
        normalizeScorePromises.push(normalizeScore(param));
        getVolatilityPromises.push(graph.getNodeVolatility(param));
    }
    // console.log('array has\n', normalizeScorePromises);

    return Promise.all(getVolatilityPromises)
     .then(results => {
        for(result of results) {
            //  console.log("result fields\n", result._fields);
             
            if(result && result._fields) {
                parentName = result._fields[0].end.properties.name
                sentiment = sentiments[parentName]
                volatility = parseFloat(result._fields[0].segments[0].relationship.properties.value);
                companyScores[parentName] = parseFloat(sentiment)*volatility;
                // console.log(parentName, companyScores[parentName]);
                
            }
        }
        return Promise.all(normalizeScorePromises)
     }).then(values => {
        getNormalizedScore();
        finalScores = getFinalScores();
        return finalScores;
     })
     .catch(error => console.log(error));

}

relations.convertToParams = function({ relations }) {
    var initParams = {}
    for (article of relations) {
        let Params =  article.sentiment.Params 
        for (param of Params) {
            
            if (param.symbol in initParams) {
                initParams[param.symbol].url.push(article.url)
                initParams[param.symbol].sentiment.push(param.sentiment)
            }
            else {
                initParams[param.symbol] = {
                    url: [article.url],
                    label: param.label,
                    sentiment: [param.sentiment]
                }
                
            }
        }
    }
    
    for(symbol in initParams) {
        initParams[symbol].sentiment = average(initParams[symbol].sentiment)
    }
    var Params = []
    for(symbol in initParams) {
        Params.push({
            symbol,
            label: initParams[symbol].label,
            news: initParams[symbol].url,
            sentiment: initParams[symbol].sentiment
        });
    }
    return Params;
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

module.exports = relations;