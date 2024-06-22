const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserQuestion = new Schema({
    types:{
        type:String,
        required:true,
    },
    questions:{
        type:String,
        required:true
    },
    isAnswered:{
        type:String
    },
    link:{
        type:String,
    },
    createdBy:{
        type:String,
        required:true
    },
    createdDate:{
        type:Date,
        default:Date.now()
    },
    updatedBy:{
        type:String,
        required:true,
    },
    updatedDate:{
        type:Date,
        default:Date.now()
    }
});

const userquestion = mongoose.model('userquestion',UserQuestion);
module.exports = userquestion;