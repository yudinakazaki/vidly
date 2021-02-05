const express = require('express')
const { Movie } = require('../models/movies')
const { Customer } = require('../models/customers')
const { Rental, validateRental } = require('../models/rentals')

const router = express.Router()

router.get('/', async (request, response) =>{
  const rentals = await Rental.find()

  return response.send(rentals)
})

router.get('/:id', async (request, response) => {
  const findRental = await Rental.findById(request.params.id)
  if(!findRental) return response.status(404).send('Rental not found')

  return response.send(findRental)
})

router.post('/', async (request, response) => {
  const { error } = validateRental(request.body)
  if(error) return response.status(400).send(error.details[0].message)

  const movie = await Movie.findById(request.body.movieId)
  const customer = await Customer.findById(request.body.customerId)

  const newRental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold
    },
    movie: {
      _id: movie.id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    },
    dateOut: request.body.dateOut,
    dateReturn: request.body.dateReturn,
    rentalFee: request.body.rentalFee
  })

  await newRental.save()

  return response.send(newRental)
})

router.put('/:id', async (request, response) => {
  const { error } = validateRental(request.body)
  if(error) return response.status(400).send(error.details[0].message)

  const movie = await Movie.findById(request.body.movieId)
  const customer = await Customer.findById(request.body.customerId)

  const updatedRental = await Rental.findByIdAndUpdate(request.params.id, {
    $set: {
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        isGold: customer.isGold
      },
      movie: {
        _id: movie.id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
      },
      dateOut: Date.now(),
      dateReturn: request.body.dateReturn,
      rentalFee: request.body.rentalFee
    }
  },
  { new: true })

  return response.send(updatedRental)
})

router.delete('/:id', async (request, response) => {
  const deletedRental = Rental.findByIdAndRemove(request.params.id)
  if(!deletedRental) return response.status(400).send('Reantal not found')

  return response.send('Rental deleted successfully!')
})

module.exports = router