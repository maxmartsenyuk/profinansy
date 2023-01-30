const express = require('express')
const router = express.Router()

const { getAllUsers, getUser } = require('../controllers/users.controller')

router
    .route('/all')
    .get(getAllUsers)

router
    .route('/id')
    .get(getUser)

module.exports = router