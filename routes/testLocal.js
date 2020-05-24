var express = require('express');
var router = express.Router();
var http = require('http');

const local = {
    host: 'localhost',
    port: 5000,
    method: 'GET'
};

/* GET home page. */
router.get('/', function(req, res, next) {
    http.request(local, (result) => {
        result.on('data', chunk => {
            chunk = chunk.toString('utf8');
            console.log(chunk);
            res.json(chunk);
        })
    }).end();
});

router.get('/suc', function(req, res, next) {

});

module.exports = router;