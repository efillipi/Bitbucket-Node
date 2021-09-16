/* eslint-disable no-undef */
const FakeRepository = require('../database/Fakes/FakeRepository')
const SingUpService = require('../services/SingUpService')
const AppError = require('../errors/AppError')

describe('SingUp', () => {
  it(' Deve ser capaz de criar um usuário ', async () => {
    const fakeRepository = new FakeRepository()

    const singUpService = new SingUpService(fakeRepository)

    const user = await singUpService.execute({
      nome: 'singUp',
      email: 'singUp@singUp.com',
      senha: '123123',
      telefones: [
        {
          numero: '123456789',
          ddd: '11',
        },
      ],
    })

    expect(user).toHaveProperty('id')
  })

  it(' Não deve ser capaz de criar um usuário com e-mail duplicado ', async () => {
    const userRepository = new FakeRepository()

    const singUpService = new SingUpService(userRepository)

    await singUpService.execute({
      nome: 'singUp',
      email: 'singUp2@singUp.com',
      senha: '123123',
      telefones: [
        {
          numero: '123456789',
          ddd: '11',
        },
      ],
    })

    await expect(
      singUpService.execute({
        nome: 'singUp2',
        email: 'singUp2@singUp.com',
        senha: '123123',
        telefones: [
          {
            numero: '123456789',
            ddd: '11',
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
