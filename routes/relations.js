const express = require('express')
const graph = require('../base/getRecord')
const RelationExtractor = require('../base/extractRelations')

const router = express.Router()

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

//main test route
router.post('/scores', function(req, res) {

    var Params = RelationExtractor.convertToParams(req.body);

/*     var Params = [
        { label: 'Organisation', sentiment: -0.025, symbol: 'LALPATHLAB.NS' },
        {
          label: 'Organisation',
          sentiment: -0.015625,
          symbol: 'ASHOKLEY.NS'
        }
      ]; */
    // console.log(Params);
    
    RelationExtractor.extractRelations({ Params })
     .then(result => {
        res.json(result);
     });
});

router.get('/parent', function(req, res) {
    params = {
        label: 'Organisation',
        symbol: "IFCI.NS",
        sentiment: 0.8
    }
    graph.getNodeVolatility(params)
    .then(parent => {
        console.log(parent[0]);
        res.json(parent)
    }); 
})

module.exports = router;