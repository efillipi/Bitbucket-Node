const express = require('express')
const SingInRouter = express()

const SingInController = require('../controllers/SingInController')

const singInController = new SingInController()

SingInRouter.post('/', singInController.execute)

module.exports = SingInRouter
