const express = require('express')
const { Movie, validateMovie } = require('../models/movies')
const { Genre } = require('../models/genres')

const router = express.Router()

router.get('/', async (request, response) => {
  const movies = await Movie.find()

  return response.send(movies)
})

router.get('/:id', async (request, response) => {
  const findMovie = await Movie.findById(request.params.id)
  if(!findMovie) return response.status(404).send('Movie not found!')

  return response.send(findMovie)
})

router.post('/', async (request, response) => {
  const { error } = validateMovie(request.body)
  if(error) return response.status(400).send(error.details[0].message)

  const genre = await Genre.findById(request.body.genreId)
  
  const newMovie = new Movie({
    title: request.body.title,
    numberInStock: request.body.numberInStock,
    dailyRentalRate: request.body.dailyRentalRate,
    genre: {
      _id: genre._id,
      name: genre.name
    }
  })

  await newMovie.save()

  return response.send(newMovie)
})

router.put('/:id', async (request, response) => {
  const { error } = validateMovie(request.body)
  if(error) return response.status(400).send(error.details[0].message)

  const genre = await Genre.findById(request.body.genreId)

  const updatedMovie = await Movie.findByIdAndUpdate(request.params.id, {
    $set: {
      title: request.body.title,
      numberInStock: request.body.numberInStock,
      dailyRentalRate: request.body.dailyRentalRate,
      genre: {
        _id: genre.id,
        name: genre.name
      }
    }
  },
  { new: true })

  if(!updatedMovie) return response.status(404).send('Movie not found!')
  
  return response.send(updatedMovie)
})

router.delete('/:id', async (request, response) => {
  const deletedMovie = await Movie.findByIdAndRemove(request.params.id)
  if(!deletedMovie) return response.status(404).send('Movie not found!')

  return response.send('Course deleted sucessfully!')
  
})

module.exports = router