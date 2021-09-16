const AppError = require('../errors/AppError')
const { isAfter, addMinutes } = require('date-fns')

class FindUserService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }
  async execute({ user_id, token }) {
    const user = await this.userRepository.findById(user_id)

    if (!user) {
      throw new AppError(
        `Não foi encontrado nenhum usuario com o id: '${user_id}' informado.`,
        404,
      )
    }

    if (token !== user.token) {
      throw new AppError('Não autorizado', 401)
    }

    const dataLogin = user.data_login
    const compareDate = addMinutes(dataLogin, 30)

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError(`Sessão inválida.`, 401)
    }

    return user
  }
}

module.exports = FindUserService
