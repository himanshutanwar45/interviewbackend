const mongoose = require('mongoose');
const {Schema} = mongoose;

const CreateUser = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false
    },
    password:{
        type:String,
        required:true
    },
    machineName:{
        type:String,
        required:true,
    },
    IPAddress:{
        type:String,
        required:true
    },
    createdDate:{
        type:Date,
        default:Date.now()
    },
    lastLoginMachineName:{
        type:String,
        required:true,
    },
    lastLoginIPAddress:{
        type:String,
        required:true
    },
    updatedDate:{
        type:Date,
        default:Date.now()
    }

});

const createuser = mongoose.model('logindetails',CreateUser);
module.exports = createuser;