const { hash, compare } = require('bcrypt')

class BCryptHashProvider {
  generateHash(payload) {
    return hash(payload, 8)
  }

  compareHash(payload, hashed) {
    return compare(payload, hashed)
  }
}
module.exports = BCryptHashProvider
