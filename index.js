const routes = require('./routes/index.routers')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const session = require('express-session')

const connectRedis = require('connect-redis')
const redis = require('redis')
const redisStorage = connectRedis(session)
mongoose.set('strictQuery', false)

const redisClient = redis.createClient({
    url: 'redis://@192.168.1.120:6379'
})


const app = express()
app.use(express.urlencoded({extended: true}))

// app.use(session({
//       store: new redisStorage({
//         client: redisClient,
//       }),
//       secret: process.env.SESSION_KEY,
//       resave: true,
//       saveUninitialized: true,
//     }))

app.use(express.json())
app.use('/', routes)


const startApp = async ()=>{
    await redisClient.connect()
    redisClient.on('connect', () => console.log('::> Redis Client Connected'))

    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true
       
    })

    const db = mongoose.connection

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("connected to " + process.env.MONGO_URL)
        app.listen(process.env.PORT, ()=>console.log(`server ran on port: ${process.env.PORT}`) )
      })
}

startApp()