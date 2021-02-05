const mongoose = require('mongoose')
const Joi = require('joi')

const genreSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true
  }
})

const Genre = new mongoose.model('Genre', genreSchema)

function validateGenre(genre) {
  const joiSchema = Joi.object({
    name: Joi.string().min(3).required(),
  })

  return joiSchema.validate(genre)
}

module.exports.genreSchema = genreSchema
module.exports.Genre = Genre
module.exports.validateGenre = validateGenre
