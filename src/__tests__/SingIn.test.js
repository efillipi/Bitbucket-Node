/* eslint-disable no-undef */
const FakeRepository = require('../database/Fakes/FakeRepository')
const SingInService = require('../services/SingInService')
const SingUpService = require('../services/SingUpService')
const FakeHashProvider = require('../provider/hashProvider/FakeHashProvider')
const AppError = require('../errors/AppError')

describe('SingIn', () => {
  it(' Deve ser capaz de logar com um usuário ', async () => {
    const fakeRepository = new FakeRepository()
    const fakeHashProvider = new FakeHashProvider()
    const singUpService = new SingUpService(fakeRepository)
    const singInService = new SingInService(fakeRepository, fakeHashProvider)

    await singUpService.execute({
      nome: 'SingIn',
      email: 'singIn@SingIn.com',
      senha: '123123',
      telefones: [
        {
          numero: '123456789',
          ddd: '11',
        },
      ],
    })

    const userSingIn = await singInService.execute({
      email: 'singIn@SingIn.com',
      senha: '123123',
    })
    expect(userSingIn.email).toBe('singIn@SingIn.com')
  })

  it(' Não Deve ser capaz de logar com um email invalido ', async () => {
    const fakeRepository = new FakeRepository()
    const fakeHashProvider = new FakeHashProvider()
    const singInService = new SingInService(fakeRepository, fakeHashProvider)

    await expect(
      singInService.execute({
        email: 'singIn_invalido@singIn.com',
        senha: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it(' Não Deve ser capaz de logar com a senha invalido', async () => {
    const fakeRepository = new FakeRepository()
    const fakeHashProvider = new FakeHashProvider()
    const singUpService = new SingUpService(fakeRepository)
    const singInService = new SingInService(fakeRepository, fakeHashProvider)

    await singUpService.execute({
      nome: 'SingIn',
      email: 'singIn2@SingIn.com',
      senha: '123123',
      telefones: [
        {
          numero: '123456789',
          ddd: '11',
        },
      ],
    })

    await expect(
      singInService.execute({
        email: 'singIn2@SingIn.com',
        senha: '1231234',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
