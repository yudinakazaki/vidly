const jwt = require('jsonwebtoken')

module.exports = function(request, response, next) {
  const token = request.header('x-auth-token')
  if(!token) return response.status(401).send('You need to be logged to this!')

  try{
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY)
    request.user = decoded
    next()
  } catch {
    return response.status(400).send('Invalid token!')
  }
}