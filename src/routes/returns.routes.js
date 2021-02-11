const express = require('express')
const Joi = require('joi')

const { Rental } = require('../models/rentals')
const { Movie } = require('../models/movies')

const authentication = require('../middlewares/authentication')
const validateInput = require('../middlewares/validateInput')

const router = express.Router()

router.post('/', [authentication, validateInput(validateReturn)], async (request, response) => {
  const rental = await Rental.lookup(request.body.customerId, request.body.movieId)

  if(!rental) return response.status(404).send('Rental not found!')

  if(rental.dateReturned) return response.status(400).send('Rental already processed')

  rental.return()
  await rental.save()

  await Movie.update({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1}
  })

  return response.send(rental)
})

function validateReturn(rental){
  const returnJoiSchema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  })

  return returnJoiSchema.validate(rental)
}



module.exports = router