const ICrud = require('../interfaces/ICrud')
const uuid = require('uuid')

class MongoDB extends ICrud {
  constructor() {
    super()
    this.user = []
  }
  create({ nome, email, senha, telefones }) {
    Object.assign(this.user, {
      id: uuid.v4(),
      nome,
      email,
      senha,
      telefones,
      token: uuid.v4(),
      data_login: Date.now(),
      data_criacao: Date.now(),
      data_atualizacao: Date.now(),
    })
    this.user.push(this.user)

    return this.user
  }

  findEmail({ email }) {
    const find = this.user.find((user) => user.email === email)
    return find
  }

  update(id, user) {
    const FindIndex = this.user.findIndex((findUser) => findUser.id === id)
    this.user[FindIndex] = user

    return user
  }

  findById(user_id) {
    const findById = this.user.find((user) => user.id === user_id)
    return findById
  }
}

module.exports = MongoDB
