const express = require('express')
const { Customer, validateCustomer } = require('../models/customers')
const authentication = require('../middlewares/authentication')
const admin = require('../middlewares/admin')

const router = express.Router()

router.get('/', async (request, response) => {
  const customers = await Customer.find()

  return response.send(customers)
})

router.get('/:id', async (request, response) => {
  const findCustomer = await Customer.findById(request.params.id)

  if(!findCustomer) return response.status(404).send('Customer not found!')

  return response.send(findCustomer)
})

router.post('/',authentication, async (request, response) => {
  const newCustomer = new Customer({
    name: request.body.name,
    phone: request.body.phone,
    isGold: request.body.isGold
  })
  
  const { error } = validateCustomer(request.body)
  
  if(error) return response.status(400).send(error.details[0].message)
 
  await newCustomer.save()
  
  response.send(newCustomer)
 
})

router.put('/:id',authentication, async (request, response) => {

  const { error } = validateCustomer(request.body)

  if(error) return response.status(400).send(error.details[0].message)

  const updatedCustomer = await Customer.findByIdAndUpdate(request.params.id, {
    $set: { 
      name: request.body.name,
      phone: request.body.phone,
      isGold: request.body.isGold
    }}, 
    { new: true }) 
      
  if(!updatedCustomer) return response.status(404).send('Customer not found')
  
  return response.send(updatedCustomer)
})

router.delete('/:id',[authentication, admin], async (request, response) => {
  const removedCustomer = await Customer.findByIdAndRemove(request.params.id)

  if(!removedCustomer) return response.status(404).send('Customer not found!')

  return response.send('Customer deleted successfully!')
})

module.exports = router