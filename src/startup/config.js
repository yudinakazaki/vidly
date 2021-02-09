require('dotenv').config()

module.exports = function() {
  if(!process.env.JWTPRIVATEKEY) {
  throw new Error('FATAL ERROR: jwtprivatekey is not defined!')
  }
}