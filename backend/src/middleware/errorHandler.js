export function errorHandler(error, _request, response, _next) {
  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({
      message: 'The request body contains invalid JSON.',
    })
  }

  if (error.type === 'entity.too.large') {
    return response.status(413).json({
      message: 'The request body is too large.',
    })
  }

  console.error(error)

  return response.status(500).json({
    message: 'An unexpected server error occurred.',
  })
}
