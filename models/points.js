const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResultSchema = new Schema({
    user: String,
    timeStamp: { type: Date, default: Date.now },
    timeDuration: Number,
    //averageTime: Number,
    guesses: Number,
    failures: Number,
    omissions: Number,
    points: Number,
    hash: String
})

//crear modelo

const Result = mongoose.model('Result', ResultSchema);

module.exports = Result;