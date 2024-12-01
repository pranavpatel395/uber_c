const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const cors = require("cors")
const cookieParser = require('cookie-parser')
const connectToDb = require('./db/db.js')
const userRouter = require("./router/user.router.js")


const app = express()

connectToDb()


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({urlencoded: true}))
app.use(cookieParser())


app.get('/', (req, res)=>{
  res.send('hello word')
  
})

app.use('/users', userRouter)

module.exports = app