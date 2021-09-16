const SingUpService = require('../services/SingUpService')
const yup = require('yup')
const AppError = require('../errors/AppError')
const UserRepository = require('../database/repositories/UserRepository')
const User = require('../database/shemas/User')

class SingUpController {
  async execute(request, response) {
    const userRepository = new UserRepository(User)
    const singUpService = new SingUpService(userRepository)

    const { nome, email, senha, telefones } = request.body

    const schema = yup.object().shape({
      nome: yup.string().required('Nome é um campo obrigatório'),
      email: yup
        .string()
        .email('Digite um email válido')
        .required('Email é um campo obrigatório'),
      senha: yup
        .string()
        .min(6, 'No mínimo 6 caracteres no campo de senha')
        .required('Senha é um campo obrigatório'),
      telefones: yup
        .array(
          yup.object().shape({
            numero: yup
              .string()
              .min(8, 'Numero de telefone invalido')
              .max(9, 'Numero de telefone invalido')
              .required('Numero é um campo obrigatório'),
            ddd: yup
              .string()
              .min(2, 'DDD invalido')
              .max(2, 'DDD invalido')
              .required('DDD é um campo obrigatório'),
          }),
        )
        .min(1, 'É necessário no mínimo um telefone')
        .required('Telefones é um campo obrigatório'),
    })

    try {
      await schema.validate(request.body, { abortEarly: false })
    } catch (error) {
      throw new AppError(`${error.errors} `, 422)
    }

    const user = await singUpService.execute({
      nome,
      email,
      senha,
      telefones,
    })

    return response.status(201).json({ user })
  }
}

module.exports = SingUpController
