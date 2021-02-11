const request = require('supertest')
const { User } = require('../../../src/models/users')
const { Genre } = require('../../../src/models/genres')

describe('auth middleware', () => {
  let token

  beforeEach(() => {
    server = require('../../../src/index')
    token = new User().generateAuthToken()
  })

  afterEach(() => Genre.remove({}))

  const exec = () => {
    return request(server)
    .post('/api/genres')
    .set('x-auth-token', token)
    .send({ name: 'genre1' })
  }

  it('should return 401 if no token is provided', async () => {
    token = ''

    const response = await exec()

    expect(response.status).toBe(401)
  })

  it('should return 400 if token is invalid', async () => {
    token = 1

    const response = await exec()

    expect(response.status).toBe(400)
  })
})