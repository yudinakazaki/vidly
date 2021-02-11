require('dotenv').config()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const { User } = require('../../../src/models/users')


describe('user.generateAuthToken', () => {
  it('should generate an authentication token and return it', () => {
    const payload = { 
      _id: new mongoose.Types.ObjectId().toHexString(), 
      isAdmin: true 
    }
    const user = new User(payload)
    const token = user.generateAuthToken()

    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY)
    expect(decoded).toMatchObject(payload) 
  })
})