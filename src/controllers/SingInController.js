const SingInService = require('../services/SingInService')
const AppError = require('../errors/AppError')
const UserRepository = require('../database/repositories/UserRepository')
const HashProvider = require('../provider/hashProvider/BCryptHashProvider')
const User = require('../database/shemas/User')
const yup = require('yup')

class SingInController {
  async execute(request, response) {
    const hashProvider = new HashProvider()
    const userRepository = new UserRepository(User)
    const singInService = new SingInService(userRepository, hashProvider)

    const { email, senha } = request.body

    const schema = yup.object().shape({
      email: yup
        .string()
        .email('Digite um email válido')
        .required('Email é um campo obrigatório'),
      senha: yup
        .string()
        .min(6, 'No mínimo 6 caracteres no campo de senha')
        .required('Senha é um campo obrigatório'),
    })

    try {
      await schema.validate(request.body, { abortEarly: false })
    } catch (error) {
      throw new AppError(`${error.errors} `, 422)
    }

    const user = await singInService.execute({
      email,
      senha,
    })

    return response.status(200).json({ user })
  }
}

module.exports = SingInController
