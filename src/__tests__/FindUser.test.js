/* eslint-disable no-undef */
const request = require('supertest')
const User = require('../database/shemas/User')
const app = require('../app')
const mongoose = require('mongoose')
const FakeRepository = require('../database/Fakes/FakeRepository')
const FakeHashProvider = require('../provider/hashProvider/FakeHashProvider')
const SingInService = require('../services/SingInService')
const SingUpService = require('../services/SingUpService')
const FindUserService = require('../services/FindUserService')
const AppError = require('../errors/AppError')

describe('FindUser', () => {
  afterAll(async () => {
    await User.deleteMany()
    mongoose.disconnect()
  })
  it(' Deve ser capaz de buscar um usuário após a criação', async () => {
    const fakeRepository = new FakeRepository()
    const singUpService = new SingUpService(fakeRepository)
    const findUserService = new FindUserService(fakeRepository)

    const user = await singUpService.execute({
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

    const { id, token } = user

    const findUser = await findUserService.execute({ token, user_id: id })
    expect(findUser.email).toBe('singIn@SingIn.com')
  })

  it(' Deve ser capaz de buscar um usuário após a login', async () => {
    const fakeRepository = new FakeRepository()
    const fakeHashProvider = new FakeHashProvider()
    const singUpService = new SingUpService(fakeRepository)
    const singInService = new SingInService(fakeRepository, fakeHashProvider)
    const findUserService = new FindUserService(fakeRepository)

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
    const userSingIn = await singInService.execute({
      email: 'singIn2@SingIn.com',
      senha: '123123',
    })

    const { id, token } = userSingIn

    const findUser = await findUserService.execute({ token, user_id: id })
    expect(findUser.email).toBe('singIn2@SingIn.com')
  })

  it(' Não Deve ser capaz de buscar um usuário com um token incorreto', async () => {
    const fakeRepository = new FakeRepository()
    const fakeHashProvider = new FakeHashProvider()
    const singUpService = new SingUpService(fakeRepository)
    const singInService = new SingInService(fakeRepository, fakeHashProvider)
    const findUserService = new FindUserService(fakeRepository)

    await singUpService.execute({
      nome: 'SingIn',
      email: 'singIn3@SingIn.com',
      senha: '123123',
      telefones: [
        {
          numero: '123456789',
          ddd: '11',
        },
      ],
    })
    const userSingIn = await singInService.execute({
      email: 'singIn3@SingIn.com',
      senha: '123123',
    })

    const { id } = userSingIn

    await expect(
      findUserService.execute({
        token: 'token',
        user_id: id,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it(' Não Deve ser capaz de buscar um usuário com após 30 minutos de login', async () => {
    const fakeRepository = new FakeRepository()
    const fakeHashProvider = new FakeHashProvider()
    const singUpService = new SingUpService(fakeRepository)
    const singInService = new SingInService(fakeRepository, fakeHashProvider)
    const findUserService = new FindUserService(fakeRepository)

    await singUpService.execute({
      nome: 'SingIn',
      email: 'singIn4@SingIn.com',
      senha: '123123',
      telefones: [
        {
          numero: '123456789',
          ddd: '11',
        },
      ],
    })
    const userSingIn = await singInService.execute({
      email: 'singIn4@SingIn.com',
      senha: '123123',
    })

    const { id, token } = userSingIn

    Date.now = jest.fn(() => {
      const custumDate = new Date()
      return custumDate.setMinutes(custumDate.getMinutes() + 35)
    })

    await expect(
      findUserService.execute({
        token: token,
        user_id: id,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it(' Não Deve ser capaz de buscar um usuário com user_id incorreto', async () => {
    const fakeRepository = new FakeRepository()
    const fakeHashProvider = new FakeHashProvider()
    const singUpService = new SingUpService(fakeRepository)
    const singInService = new SingInService(fakeRepository, fakeHashProvider)
    const findUserService = new FindUserService(fakeRepository)

    await singUpService.execute({
      nome: 'SingIn',
      email: 'singIn5@SingIn.com',
      senha: '123123',
      telefones: [
        {
          numero: '123456789',
          ddd: '11',
        },
      ],
    })
    const userSingIn = await singInService.execute({
      email: 'singIn5@SingIn.com',
      senha: '123123',
    })

    const { token } = userSingIn

    await expect(
      findUserService.execute({
        token: token,
        user_id: 'id',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it(' Não Deve ser capaz de buscar um usuário sem o uso do token', async () => {
    await request(app)
      .post('/sing_up')
      .send({
        nome: 'findUser02',
        email: 'findUser02@findUser02.com',
        senha: '123123',
        telefones: [
          {
            numero: '123456789',
            ddd: '11',
          },
        ],
      })

    const response = await request(app).post('/sing_in').send({
      email: 'findUser02@findUser02.com',
      senha: '123123',
    })

    const { _id } = response.body.user

    const findUser = await request(app).get(`/find_user/${_id}`)

    expect(findUser.status).toBe(401)
  })
})
