const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router()

let users = []

const secret = process.env.JWT_SECRET

function authenticate(req, res, next) {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ message: "No token provided" })
    }
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token"})
        }
        req.user = decoded
        next()
    })
}

router.get('/users', authenticate, (req, res) => {
    res.json(users)
})

router.post('/register', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ message: "Please provide username and password" })
    }

    const hashedPassword = await bcrypt.hash(password, 8)
    const newUser = { id: users.length + 1, username, password: hashedPassword }
    users.push(newUser)

    res.status(201).json({ id: newUser.id, username: newUser.username})
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    const user = users.find(u => u.username === username)
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials"})
    }

    const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' })
    res.json({ message: `Welcome, ${username}!`, token })
})

module.exports = router

