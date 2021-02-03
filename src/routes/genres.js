const express = require('express')
const Joi = require('joi')

const data = require('../data')

const router = express.Router()

router.get('/', (request, response) => {
  
  return response.send(data)
})

router.get('/:id', (request, response) => {
  const findGenre = data.find(genre => genre.id === parseInt(request.params.id))
 
  if(!findGenre) return response.status(404).send('Genre not found!')

  return response.send(findGenre)
})

router.post('/', async (request, response) => {
  
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  })

  const newGenre = {
    id: data.length + 1,
    name: request.body.name
  }

  try {
    await schema.validateAsync(request.body);
    data.push(newGenre)
    response.send(newGenre)
    
  }
  catch (error) { 
    response.status(400).send(error.details[0].message)
  }

})

router.put('/:id', async (request, response) => {
  const findGenre = data.find(genre => genre.id === parseInt(request.params.id))
 
  if(!findGenre) return response.send('Genre not found!')

  const schema = Joi.object({
    name: Joi.string().min(3).required()
  })

  
  try {
    await schema.validateAsync(request.body);
    findGenre.name = request.body.name
    return response.send(findGenre)
    
  }
  catch (error) { 
    response.status(400).send(error.details[0].message)
  }
})

router.delete('/:id', (request, response) => {
  const findGenre = data.find(genre => genre.id === parseInt(request.params.id))
 
  if(!findGenre) return response.send('Genre not found!')

  const index = data.indexOf(findGenre)
  data.splice(index, 1)

  return response.send('Genre deleted successfully!')
})


module.exports = router