const express = require('express')
const genres = require('../routes/genres.routes')
const home = require('../routes/home.routes')
const customers = require('../routes/customers.routes')
const movies = require('../routes/movies.routes')
const rentals = require('../routes/rentals.routes')
const users = require('../routes/users.routes')
const auth = require('../routes/auth.routes')

module.exports = function(app) {
  app.use(express.json())

  app.use('/', home)
  app.use('/api/genres', genres)
  app.use('/api/customers', customers)
  app.use('/api/movies', movies)
  app.use('/api/rentals', rentals)
  app.use('/api/users', users)
  app.use('/api/auth', auth)
}