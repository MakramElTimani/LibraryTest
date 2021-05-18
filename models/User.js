const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
        min: 6
    },
    LastName: {
        type: String,
        required: true,
        min: 6
    },
    Email:{
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    Password: {
        type: String,
        required: true,
        max: 16,
        min: 8
    },
    Files: {
        type: [String]
    },
    CreatedOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);