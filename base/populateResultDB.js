const csv = require('csv-parser');
const fs = require('fs');
const CompanyResult = require('../models/CompanyResult')
const dbconnect = require('../dbconnect')

async function populate() {
    var entries = []
    fs.createReadStream('../csv/finalBetaDB.csv')
    .pipe(csv())
    .on('data', function(row) {
        // console.log(row);
        entries.push(row)
        
    });
    for(row of entries) {
        try{
            const result = await CompanyResult.create({
                symbol: row.Symbol + '.NS',
                company: row.Company,
                sentiment: 0.0
            });
            console.log('result is ', result);

        } catch(err) {  
            console.log('error is thrown');
            
            console.error();
        }
    }
}
dbconnect();
console.log('connected');

populate();