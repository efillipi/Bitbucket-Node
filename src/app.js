/* eslint-disable no-console */
require('express-async-errors')
require('dotenv').config()
const express = require('express')
const routes = require('./routes/index')
const AppError = require('./errors/AppError')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
app.use(routes)

app.use((req, res, next) => {
  const erro = new Error('Rota não localizada')
  erro.status = 404
  next(erro)
})

app.use((err, _request, response, _next) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message,
    })
  }

  console.error('err : ', err)

  return response.status(500).json({
    message: `Interna Server Error ${err.message}`,
  })
})

module.exports = app
