const FindUserService = require('../services/FindUserService')
const AppError = require('../errors/AppError')
const UserRepository = require('../database/repositories/UserRepository')
const User = require('../database/shemas/User')
const yup = require('yup')

class SingUpController {
  async execute(request, response) {
    const userRepository = new UserRepository(User)
    const findUserService = new FindUserService(userRepository)

    const { user_id } = request.params
    const { token } = request.user

    const schema = yup.object().shape({
      user_id: yup.string().required('user_id é um campo obrigatório'),
    })

    try {
      await schema.validate(request.params, { abortEarly: false })
    } catch (error) {
      throw new AppError(`${error.errors} `, 422)
    }

    const user = await findUserService.execute({
      user_id,
      token,
    })

    return response.status(200).json({ user })
  }
}

module.exports = SingUpController
