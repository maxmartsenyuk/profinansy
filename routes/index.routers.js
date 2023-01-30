const express = require('express')
const router = express.Router()

const authRouter = require('./auth.router.js')
const usersRouter = require('./users.router.js')
const { isAuth } = require('../utils/authHelper')

router.use('/auth', authRouter)
router.use('/users', isAuth, usersRouter)

module.exports = router