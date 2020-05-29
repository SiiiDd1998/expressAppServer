const mongoose = require('mongoose')

const user = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    }
})

const User = mongoose.model('users', user)

module.exports = User;