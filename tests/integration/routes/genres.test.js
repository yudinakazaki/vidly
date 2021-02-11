const request = require('supertest')
const { Genre } = require('../../../src/models/genres')
const { User } = require('../../../src/models/users')

describe('/api/genres', () => {
  beforeEach(() => { server = require('../../../src/index')})  
  afterEach(async () => await Genre.remove({}))
  
  describe('GET /', () => {
    beforeEach(async () => {
      const genres = [
        {name: 'genre1'}, 
        {name: 'genre2'}
      ]
      await Genre.collection.insertMany(genres)  
    })

    afterEach(async () => await Genre.remove({}))

    it('should return all genres', async () => {
      const response = await request(server).get('/api/genres')
     
      expect(response.status).toBe(200)
      expect(response.body.some(g => g.name === 'genre1')).toBeTruthy()
      expect(response.body.some(g => g.name === 'genre2')).toBeTruthy()
      
    })
  })

  describe('GET /:id', () => {
    afterEach(async () => await Genre.remove({}))
    
    it('should return the genre that matches the given id', async () => {
     const genre = new Genre({name: 'genre1'})
     await genre.save()

     const response = await request(server).get(`/api/genres/${genre._id}`)
     expect(response.status).toBe(200)
     expect(response.body).toHaveProperty('name', genre.name)
    })

    it('should return 404 if the given id is invalid', async () => {
    const response = await request(server).get('/api/genres/1')

     expect(response.status).toBe(404)
    })
  })

  describe('POST /', () => {
    let token
    let name
    
    afterEach(async () => {
      token = new User().generateAuthToken()
      name = 'genre1'
      await Genre.remove({})
      
    })

    const exec = () => {
      return request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name })
    }

    it('should return 401 if the client is not logged in', async () => {
      token = ''

      const response = await exec()
      
      expect(response.status).toBe(401)
    })

    it('should return 400 if the genre is invalid', async () => {
      name = 1234
      
      const response = await exec()

      expect(response.status).toBe(400)
    })

    it('should save the genre if it is valid', async () => {
      await exec()

      const genre = await Genre.find({ name: 'genre1' })

      expect(genre).not.toBeNull()
    })

    it('should return the genre if it is valid', async () => {
      const response = await exec()

      expect(response.body).toHaveProperty('_id')
      expect(response.body).toHaveProperty('name', 'genre1')
    })
  })

  describe('PUT /:id', () => {
    let token
    let id
    let newName
    let genre

    beforeEach(async () => {
      genre = new Genre({name: 'genre1'})
      await genre.save()

      token = new User().generateAuthToken()
      id = genre._id
      newName = 'new genre'
    })

    afterEach(async () => await Genre.remove({}))
    
    const exec = () => {
      return request(server)
        .put(`/api/genres/${id}`)
        .set('x-auth-token', token)
        .send({ name: newName })
    }
    
    it('should return 401 if the client is not logged in', async () => {
      token = ''
      
      const response = await exec()
    
      expect(response.status).toBe(401)
    })

    it('should return 404 if id is invalid', async () => {
      id = 1
      
      const response = await exec()

      expect(response.status).toBe(404)
    })

    it('should return 400 if genre is invalid', async () => {
      newName = 1

      const response = await exec()

      expect(response.status).toBe(400)
    })

    it('should update the genre', async () => {
      await exec()

      const updatedGenre = await Genre.findById(id)

      expect(updatedGenre.name).toBe(newName)
    })

    it('should return the updated genre', async () => {
      const response = await exec()

      expect(response.body).toHaveProperty('_id')
      expect(response.body).toHaveProperty('name', newName)
    })
  })

  describe('DELETE /:id', () => {
    let id
    let token
    let genre
    
    beforeEach(async () => {
      genre = new Genre({ name: 'genre1' })
      await genre.save()
      
      token = new User({ isAdmin: true }).generateAuthToken()
      id = genre._id
    })

    afterEach(async () => await Genre.remove({}))
 
    const exec = () => {
      return request(server)
        .delete(`/api/genres/${id}`)
        .set('x-auth-token', token)
        .send()
    }

    it('should return 401 if the client is not logged in', async () => {
      token = ''

      const response = await exec()

      expect(response.status).toBe(401)
    })

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken()

      const response = await exec()

      expect(response.status).toBe(403)
    })
  
    it('should return 404 if the id is invalid', async () => {
      id = 1

      const response = await exec()

      expect(response.status).toBe(404)
    })

    it('should delete the genre and return status 200', async () => {
      const response = await exec()

      const deletedGenre = await Genre.findById(id)

      expect(response.status).toBe(200)
      expect(deletedGenre).toBeNull()
    })
  })
})