const express = require('express')
const SingUpRouter = express()

const SingUpController = require('../controllers/SingUpController')

const singUpController = new SingUpController()

SingUpRouter.post('/', singUpController.execute)

module.exports = SingUpRouter
