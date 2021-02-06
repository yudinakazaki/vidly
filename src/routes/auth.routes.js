const express = require('express')
const Joi = require('joi')
const bcrypt = require('bcrypt')

const { User } = require('../models/users')

const router = express.Router()

router.post('/', async (request, response) =>{
  const { error } = validate(request.body)
  if(error) return response.status(400).send(error.details[0].message)

  const user = await User.findOne({ email: request.body.email })
  if(!user) return response.status(400).send('Invalid e-mail or password!')

  const validPassword = await bcrypt.compare(request.body.password, user.password)
  if(!validPassword) return response.status(400).send('Invalid e-mail or password!')

  const token = user.generateAuthToken()

  return response.send(token)
})

function validate(user){
  const joiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })

  return joiSchema.validate(user)
}

module.exports = router