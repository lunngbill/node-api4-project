require('dotenv').config()

const server = require('./server')

const Port = 4000

server.listen(Port, () => {
    console.log(`Server is running on port ${Port}`)
})