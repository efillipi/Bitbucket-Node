const AppError = require('../errors/AppError')
const jwt = require('jsonwebtoken')

module.exports = async function ensureAuth(request, _response, next) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('Não autorizado', 401)
  }

  const [, token] = authHeader.split(' ')

  try {
    jwt.verify(token, process.env.JWT_KEY)

    request.user = {
      token: token,
    }

    return next()
  } catch (error) {
    throw new AppError('Não autorizado', 401)
  }
}
