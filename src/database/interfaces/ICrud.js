/* eslint-disable no-unused-vars */
class NotImplementedException extends Error {
  constructor() {
    super('Not implemented exception')
  }
}

class ICrud {
  create({ item }) {
    throw new NotImplementedException()
  }
  findEmail({ item }) {
    throw new NotImplementedException()
  }
  update({ item }) {
    throw new NotImplementedException()
  }
  findById({ item }) {
    throw new NotImplementedException()
  }
}

module.exports = ICrud
