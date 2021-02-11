const { User } = require('../../../src/models/users')
require('dotenv').config()

const authentication = require('../../../src/middlewares/authentication')


describe('auth middleware', () => {
  it('should ', () => {
    const user = {isAdmin: true}
    const token = new User(user).generateAuthToken()

    const request = {
      header: jest.fn().mockReturnValue(token)
    }
    const response = {}
    const next = jest.fn()
    authentication(request, response, next)

    expect(request.user).toMatchObject(user)
  })
})