const mongoose = require('mongoose')
const express = require('express')
const Joi = require('joi')

const router = express.Router()

const genreSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true
  }
})

const Genre = new mongoose.model('Genre', genreSchema)

router.get('/', async (request, response) => {
  
  const genres = await Genre.find()

  return response.send(genres)
})

router.get('/:id', async (request, response) => {
  const findGenre = await Genre.findById(request.params.id)
  
  if(!findGenre) return response.status(404).send('Genre not found!')
  
  return response.send(findGenre)
})

router.post('/', async (request, response) => {
  
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  })

  const newGenre = new Genre({ name: request.body.name })

  try {
    await schema.validateAsync(request.body);
    await newGenre.save()
    response.send(newGenre)
    
  }
  catch (error) { 
    response.status(400).send(error.details[0].message)
  }

})

router.put('/:id', async (request, response) => {  
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  })

  const updatedGenre = await Genre.findByIdAndUpdate(request.params.id,
    { $set: { name: request.body.name }},
    { new: true })

  if(!updatedGenre) return response.send('Genre not found!')

  try {
    await schema.validateAsync(request.body);
    return response.send(updatedGenre)
  }
  catch (error) { 
    response.status(400).send(error.details[0].message)
  }
})

router.delete('/:id', async (request, response) => {  
  const removedGenre = await Genre.findByIdAndRemove(request.params.id)

  if(!removedGenre) return response.send('Genre not found!')

  return response.send('Genre deleted successfully!')
})

module.exports = router