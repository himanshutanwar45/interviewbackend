const mongoose = require('mongoose')
const {Schema} = mongoose

const Question = new Schema({
    types:{
        type:String,
        required:true,
    },
    questions:{
        type:String,
        required:true
    },
    answers:{
        type:String,
        required:true
    },
    createdDate:{
        type:Date,
        default:Date.now()
    }
})

const question = mongoose.model('questions',Question)

module.exports = question;