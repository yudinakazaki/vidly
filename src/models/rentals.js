const mongoose = require('mongoose')
const Joi = require('joi')

const Rental = mongoose.model('Rental', new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      phone: {
        type: Number,
        required: true
      },
      isGold: {
        type: Boolean,
        min: 8,
        max: 9,
        required: true
      }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true
      },
      dailyRentalRate: {
        type: Number,
        min: 0,
        required: true
      }
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    default: Date.now,
    required: true
  },
  dateReturn: Date,
  rentalFee: {
    type: Number,
    min: 0
  }
}))

function validateRental(rental) {
  const joiSchema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  })

  return joiSchema.validate(rental)
}

module.exports.Rental = Rental
module.exports.validateRental = validateRental