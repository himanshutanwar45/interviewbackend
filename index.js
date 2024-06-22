const connectToMongodb = require('./db')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

connectToMongodb()
const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT

//Routes
app.use('/api/questions', require('./routes/Questions/R_Questions'))

app.use('/api/auth', require('./routes/auth/R_Login'))

app.listen(port, () => {
    console.log(`Weekend Support app listening on port ${port}`)
})

