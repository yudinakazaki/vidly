const mongoose = require('mongoose')
const Joi = require('joi')
const { genreSchema } = require('../models/genres')

const Movie = mongoose.model('Movie', new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  numberInStock: {
    type: Number,
    min: 0,
    required: true
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    required: true
  },
  genre: {
    type: genreSchema,
    min: 0,
    required: true
  }
}))

function validateMovie(movie){
  const joiSchema = Joi.object({
    title: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
    genreId: Joi.objectId().required()
  })

  return joiSchema.validate(movie)
}

module.exports.Movie = Movie
module.exports.validateMovie = validateMovie