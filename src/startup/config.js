require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.testing' : '.env'
})

module.exports = function() {
  if(!process.env.JWTPRIVATEKEY) {
  throw new Error('FATAL ERROR: jwtprivatekey is not defined!')
  }
}