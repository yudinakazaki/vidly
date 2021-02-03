const express = require('express')
const genres = require('./routes/genres')
const home = require('./routes/home')

const app = express()

app.use(express.json())

app.use('/', home)

app.use('/api/genres', genres)

app.listen(3000, () => console.log('Server is running!!'))