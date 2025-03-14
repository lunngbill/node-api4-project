require('dotenv').config()

const express = require('express')
const cors = require('cors')

const userRouter = require('./api/users-router')

const server = express()

server.use(express.json())
server.use(cors())
server.use('/api', userRouter)

server.get('/', (req, res) => {
    res.send('API is running...')
})

module.exports = server