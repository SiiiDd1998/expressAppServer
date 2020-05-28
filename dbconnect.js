const mongoose = require('mongoose')

function connect () {
    mongoose.set('useCreateIndex', true);
    mongoose.connect('mongodb://localhost:27017/hack',{useNewUrlParser: true})
}

module.exports = connect