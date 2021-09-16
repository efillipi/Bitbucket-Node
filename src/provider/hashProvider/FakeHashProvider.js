class FakeHashProvider {
  generateHash(payload) {
    return payload
  }

  compareHash(payload, hashed) {
    const hashPassword = payload === hashed

    return hashPassword
  }
}
module.exports = FakeHashProvider
