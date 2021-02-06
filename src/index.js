require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const genres = require('./routes/genres.routes')
const home = require('./routes/home.routes')
const customers = require('./routes/customers.routes')
const movies = require('./routes/movies.routes')
const rentals = require('./routes/rentals.routes')
const users = require('./routes/users.routes')
const auth = require('./routes/auth.routes')

mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected'))
  .catch(err => console.error('Error connecting', err))

const app = express()

if(!process.env.JWTPRIVATEKEY){
  console.error('FATAL ERROR: jwtPrivateKey is not defined!')
  process.exit(1)
}

app.use(express.json())

app.use('/', home)
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/auth', auth)

app.listen(3000, () => console.log('Server is running!!'))