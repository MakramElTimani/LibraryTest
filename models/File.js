const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    FileName: {
        type: String
    },
    FilePath: {
        type: String
    },
    Type:{
        type: String,
        required: true
    },
    Parent: {
        type: String
    },
    CreatedBy: {
        type: String
    },
    CreatedOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('File', fileSchema);