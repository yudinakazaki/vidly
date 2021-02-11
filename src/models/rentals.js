const mongoose = require('mongoose')
const Joi = require('joi')
const moment = require('moment')

const rentalSchema = new mongoose.Schema({
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
        default: false
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
  },
  dateReturned: Date,
  rentalFee: {
    type: Number,
    min: 0
  }
})

rentalSchema.statics.lookup = function(customerId, movieId) {
  return this.findOne({ 
    'customer._id': customerId,
    'movie._id': movieId
  })
}

rentalSchema.methods.return = function(){
  this.dateReturned = Date.now()
  
  const rentalDays = moment().diff(this.dateOut, 'days')
  this.rentalFee = rentalDays * this.movie.dailyRentalRate
}

const Rental = mongoose.model('Rental', rentalSchema)

function validateRental(rental) {
  const joiSchema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  })

  return joiSchema.validate(rental)
}

module.exports.Rental = Rental
module.exports.validateRental = validateRental