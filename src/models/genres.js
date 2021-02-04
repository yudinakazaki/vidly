const mongoose = require('mongoose')
const Joi = require('joi')

const Genre = new mongoose.model('Genre', new mongoose.Schema({
  name: { 
    type: String,
    required: true
  }
}))

function validateGenre(genre) {
  const joiSchema = Joi.object({
    name: Joi.string().min(3).required(),
  })

  return joiSchema.validate(genre)
}

module.exports.Genre = Genre
module.exports.validateGenre = validateGenre
