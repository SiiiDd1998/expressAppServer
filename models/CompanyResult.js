const mongoose = require('mongoose')
const Double = require('@mongoosejs/double')

const Company = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        unique: true
    },
    company: {
        type: String,
        required: true
    },
    sentiment: {
        type: Double,
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

const CompanyResults = mongoose.model('CompanyResults', Company);

module.exports = CompanyResults;