const mongoose = require('mongoose')
require('dotenv').config()
const MONGOURI = process.env.MONGOURL

async function connectToMongodb(){
    await mongoose.connect(MONGOURI,{dbName:"interviewQuestion"}).then(()=>console.log("Connected to mongodb successfully")).catch(err=>console.log(err.message));
}

module.exports = connectToMongodb;