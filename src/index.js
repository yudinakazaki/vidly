const mongoose = require('mongoose')
const express = require('express')
const genres = require('./routes/genres.routes')
const home = require('./routes/home.routes')
const customers = require('./routes/customers.routes')

mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected'))
  .catch(err => console.error('Error connecting', err))

const app = express()

app.use(express.json())

app.use('/', home)

app.use('/api/genres', genres)

app.use('/api/customers', customers)

app.listen(3000, () => console.log('Server is running!!'))