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
    }
})

const User = mongoose.model('users', user)

module.exports = User;