const express = require('express')
const winston = require('winston')

const app = express()

require('./startup/logging')()
require('./startup/config')()
require('./startup/db')()
require('./startup/validation')()
require('./startup/routes')(app)

const port = process.env.PORT || 3000

if(process.env.NODE_ENV !== 'test'){
  app.listen(port, () => winston.info('Server is running!!'))
}

module.exports = app