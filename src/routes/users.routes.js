const express = require('express')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const authentication = require('../middlewares/authentication')

const { User, validateUser } = require('../models/users')

const router = express.Router()

router.get('/me', authentication, async (request, response) => {
  const findUser = await User.findById(request.user._id).select('-password')

  response.send(findUser)
})

router.post('/', async (request, response) => {
  const { error } = validateUser(request.body)
  if(error) return response.status(400).send(error.details[0].message)

  const user = await User.findOne({ email: request.body.email })
  if(user) return response.status(400).send('E-mail already registered')

  const newUser = new User(_.pick(request.body, ['name', 'email', 'password']))
  const salt = await bcrypt.genSalt(10)
  newUser.password = await bcrypt.hash(newUser.password, salt)
  
  const token = newUser.generateAuthToken()
  
  await newUser.save()

  return response.send(_.pick(newUser, ['_id', 'name', 'email']))
})

module.exports = router