const express = require('express')
const { Genre, validateGenre } = require('../models/genres')
const authentication = require('../middlewares/authentication')
const admin = require('../middlewares/admin')

const router = express.Router()

router.get('/', async (request, response) => {
  
  const genres = await Genre.find()

  return response.send(genres)
})

router.get('/:id', async (request, response) => {
  const findGenre = await Genre.findById(request.params.id)
  if(!findGenre) return response.status(404).send('Genre not found!')
  
  return response.send(findGenre)
})

router.post('/',authentication, async (request, response) => {
  
  const { error } = validateGenre(request.body)
  if(error) return response.status(400).send(error.details[0].message)

  const newGenre = new Genre({ name: request.body.name })

  await newGenre.save()

  response.send(newGenre)
})

router.put('/:id',authentication, async (request, response) => {  
  const { error } = validateGenre(request.body)
  if(error) return response.status(400).send(error.details[0].message)

  const updatedGenre = await Genre.findByIdAndUpdate(request.params.id,
    { $set: { name: request.body.name }},
    { new: true })

  if(!updatedGenre) return response.send('Genre not found!')

  return response.send(updatedGenre)
})

router.delete('/:id',[authentication, admin], async (request, response) => {  
  const removedGenre = await Genre.findByIdAndRemove(request.params.id)
  if(!removedGenre) return response.send('Genre not found!')

  return response.send('Genre deleted successfully!')
})

module.exports = router