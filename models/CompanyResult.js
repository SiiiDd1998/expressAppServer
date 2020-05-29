const mongoose = require('mongoose')

const company = new mongoose.Schema({
    ticker: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    sentiment: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    news: {
        type: [String]
    }
});

const CompanyResults = mongoose.model('CompanyResults', company);

module.exports = CompanyResults;