module.exports = (validator) => {
  return (request, response, next) => {
    const { error } = validator(request.body)
    if(error) return response.status(400).send(erro.details[0].message)
    next()
  }
}
