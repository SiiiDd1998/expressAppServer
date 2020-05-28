const mongoose = require('mongoose')

function connect () {
    mongoose.set('useCreateIndex', true);
    mongoose.connect('mongodb+srv://pratik:Pratik@000@cluster0-ao5ty.mongodb.net/hack?retryWrites=true&w=majority',{useNewUrlParser: true})
}

module.exports = connect