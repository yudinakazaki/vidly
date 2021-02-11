const mongoose = require('mongoose')
const request = require('supertest')
const moment = require('moment')

const { User } = require('../../../src/models/users')
const { Rental } = require('../../../src/models/rentals')
const { Movie } = require('../../../src/models/movies')

describe('/api/returns', () => {
  let server
  let customerId
  let movieId
  let rental
  let token


  beforeEach(async () => {
    server = require('../../../src/index')

    customerId = mongoose.Types.ObjectId()
    movieId = mongoose.Types.ObjectId()

    movie = new Movie({
      _id: movieId,
      title: 'movie title',
      dailyRentalRate: 2,
      genre: { name: 'genre1' },
      numberInStock: 10
    })

    await movie.save()

    rental = new Rental({
      customer: {
        _id: customerId,
        name: 'customer name',
        phone: '1234',
      },
      movie: {
        _id: movieId,
        title: 'movie title',
        dailyRentalRate: 2
      }
    })

    await rental.save()

    token = new User().generateAuthToken()
  })

  afterEach(async () => {
    await Rental.remove({})
    await Movie.remove({})
  })

  const exec = async () => {
    return await request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId })
  }

  it('should return 401 if the client is not logged in', async () => {
    token = ''
    
    const response = await exec()

    expect(response.status).toBe(401)
  })

  it('should return 400 if the customerId is not provided', async () => {
    customerId = ''
    
    const response = await exec()
    
    expect(response.status).toBe(400)
  })

  it('should return 400 if the movieId is not provided', async () => {
    movieId = ''

    const response = await exec()
    
    expect(response.status).toBe(400)
  })

  it('should return 404 if no rental found for this movie/customer', async () => {
    await Rental.remove({})

    const response = await exec()

    expect(response.status).toBe(404)
  })

  it('should return 400 if rental already processed', async () => {
    rental.dateReturned = new Date()

    await rental.save()
    
    const response = await exec()

    expect(response.status).toBe(400)
  })

  it('should return 200 if it is a valid request', async () => {
    const response = await exec()

    expect(response.status).toBe(200)
  })
  
  it('should set and return the returned date', async () => {
    await exec()
    
    const rentalInDb = await Rental.findById(rental._id)

    const dateDiff = Date.now() - rentalInDb.dateReturned
    expect(rentalInDb.dateReturned).toBeDefined()
    expect(dateDiff).toBeLessThan(10 * 1000)
  })

  it('should return the movie rental fee', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate()
    await rental.save()

    await exec()

    const rentalInDb = await Rental.findById(rental._id)
    expect(rentalInDb.rentalFee).toBe(14)
  })

  it('should increase the movie stock', async () => {
    await exec()

    const movieInDb = await Movie.findById(movieId)
    expect(movieInDb.numberInStock).toBe(movie.numberInStock+1)
  })

  it('should return the rental', async () => {
    const response = await exec()

    expect(Object.keys(response.body)).toEqual(
      expect.arrayContaining([
        'dateOut',
        'dateReturned',
        'rentalFee',
        'customer',
        'movie'
      ]))
  })
})