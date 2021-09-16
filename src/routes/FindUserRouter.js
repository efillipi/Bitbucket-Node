const express = require('express')
const FindUserRouter = express()
const ensureAuth = require('../middlewares/ensureAuth')

const FindUserController = require('../controllers/FindUserController')

const findUserController = new FindUserController()

FindUserRouter.use(ensureAuth)

FindUserRouter.get('/:user_id', findUserController.execute)

module.exports = FindUserRouter
