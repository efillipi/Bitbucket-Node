const express = require('express')
const routes = express()

const SingUpRouter = require('./SingUpRouter')
const SingInRouter = require('./SingInRouter')
const FindUserRouter = require('./FindUserRouter')

routes.use('/sing_up', SingUpRouter)
routes.use('/sing_in', SingInRouter)
routes.use('/find_user', FindUserRouter)

module.exports = routes
