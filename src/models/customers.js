const mongoose = require('mongoose')
const Joi = require('joi')

const Customer = mongoose.model('Customer', new mongoose.Schema({
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
}))

function validateCustomer(customer) {
  const joiSchema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.number().min(8).required(),
    isGold: Joi.boolean().required()
  })

 return joiSchema.validate(customer)
}

module.exports.Customer = Customer
module.exports.validateCustomer = validateCustomer
