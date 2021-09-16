module.exports = class AppError {
  constructor(message, statusCode = 400) {
    this.message = message
    this.statusCode = statusCode
  }
}
