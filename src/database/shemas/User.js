require('dotenv').config()
const mongoose = require('../index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    require: true,
  },
  nome: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
  },
  senha: {
    type: String,
    require: true,
  },
  telefones: [
    {
      numero: {
        type: String,
        require: true,
      },
      ddd: {
        type: String,
        require: true,
      },
    },
  ],
  token: {
    type: String,
    require: true,
  },
  data_login: {
    type: Date,
    default: Date.now,
  },
  data_criacao: {
    type: Date,
    default: Date.now,
  },
  data_atualizacao: {
    type: Date,
    default: Date.now,
  },
})

UserSchema.pre('save', async function (next) {
  this._id = uuid.v4()
  const hash = await bcrypt.hash(this.senha, 10)
  this.senha = hash
  this.token = jwt.sign({}, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRESIN,
  })
  next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User
