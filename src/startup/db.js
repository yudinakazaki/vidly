const mongoose = require('mongoose')
const winston = require('winston')

module.exports = function() {
  const db = process.env.DB

  mongoose.connect(db,  {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => winston.info(`Connected to ${db}`))
}