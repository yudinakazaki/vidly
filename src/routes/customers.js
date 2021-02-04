const mongoose = require('mongoose')
const express = require('express')
const Joi = require('joi')

const router = express.Router()

const customerSchema = new mongoose.Schema({
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
    required: true
  }
})

const Customer = mongoose.model('Customer', customerSchema)

router.get('/', async (request, response) => {
  const customers = await Customer.find()

  return response.send(customers)
})

router.get('/:id', async (request, response) => {
  const findCustomer = await Customer.findById(request.params.id)

  if(!findCustomer) return response.status(404).send('Customer not found!')

  return response.send(findCustomer)
})

router.post('/', async (request, response) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.number().min(8).required(),
    isGold: Joi.boolean().required()
  })
  
  const newCustomer = new Customer({
    name: request.body.name,
    phone: request.body.phone,
    isGold: request.body.isGold
  })

  try{
    await joiSchema.validateAsync(request.body);
    await newCustomer.save()
    response.send(newCustomer)
  } catch (error) {
    response.status(400).send(error.details[0].message)
  }

})

router.put('/:id', async (request, response) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.number().min(8).required(),
    isGold: Joi.boolean().required()
  })
  
  try {
    await joiSchema.validateAsync(request.body);
      const updatedCustomer = await Customer.findByIdAndUpdate(request.params.id, {
      $set: { 
        name: request.body.name,
        phone: request.body.phone,
        isGold: request.body.isGold
      }}, 
      { new: true }) 
    if(!updatedCustomer) return response.status(404).send('Customer not found')
   
    return response.send(updatedCustomer)
  } catch (error) {
    response.status(400).send(error.details[0].message)
  }


  return response.send(updatedCustomer)
})

router.delete('/:id', async (request, response) => {
  const removedCustomer = await Customer.findByIdAndRemove(request.params.id)

  if(!removedCustomer) return response.status(404).send('Customer not found!')

  return response.send('Customer deleted successfully!')
})

module.exports = router