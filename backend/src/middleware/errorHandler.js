export function errorHandler(error, _request, response, _next) {
  console.error(error)

  response.status(500).json({
    message: 'An unexpected server error occurred.',
  })
}
