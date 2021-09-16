const AppError = require('../errors/AppError')
const jwt = require('jsonwebtoken')

class SingInService {
  constructor(userRepository, HashProvider) {
    this.userRepository = userRepository
    this.HashProvider = HashProvider
  }
  async execute({ email, senha }) {
    const userExists = await this.userRepository.findEmail({ email })

    if (!userExists) {
      throw new AppError('Usuário e/ou senha inválidos', 401)
    }

    const hashPassword = await this.HashProvider.compareHash(
      senha,
      userExists.senha,
    )

    if (!hashPassword) {
      throw new AppError('Usuário e/ou senha inválidos', 401)
    }

    userExists.token = jwt.sign({}, process.env.JWT_KEY, {
      expiresIn: process.env.JWT_EXPIRESIN,
    })
    userExists.data_login = Date.now()
    userExists.data_atualizacao = Date.now()

    await this.userRepository.update(userExists.id, userExists)

    return userExists
  }
}

module.exports = SingInService
