require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(
  `mongodb://${process.env.DB_HOST}/${
    process.env.NODE_ENV === 'test' ? 'bitbucket_test' : 'bitbucket'
  }`,
  {
    useNewUrlParser: true,
  },
)
mongoose.Promise = global.Promise

module.exports = mongoose
