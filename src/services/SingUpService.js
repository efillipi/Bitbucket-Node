const AppError = require('../errors/AppError')

class SingUpService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }
  async execute({ nome, email, senha, telefones }) {
    const userExists = await this.userRepository.findEmail({ email })

    if (userExists) {
      throw new AppError('E-mail já existente', 409)
    }

    const user = await this.userRepository.create({
      nome,
      email,
      senha,
      telefones,
    })

    return user
  }
}

module.exports = SingUpService
