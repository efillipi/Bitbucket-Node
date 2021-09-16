const ICrud = require('../interfaces/ICrud')

class MongoDB extends ICrud {
  constructor(schema) {
    super()
    this._schema = schema
  }

  create({ nome, email, senha, telefones }) {
    return this._schema.create({ nome, email, senha, telefones })
  }

  findEmail({ email }) {
    return this._schema.findOne({ email })
  }

  update(id, user) {
    return this._schema.updateOne({ _id: id }, { $set: user })
  }

  findById(user_id) {
    return this._schema.findById(user_id)
  }
}

module.exports = MongoDB
