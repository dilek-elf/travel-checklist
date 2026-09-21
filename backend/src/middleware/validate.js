export function validate(schema, source) {
  return (request, response, next) => {
    const result = schema.safeParse(request[source])

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
      }))

      return response.status(400).json({
        message: 'Validation failed.',
        errors,
      })
    }

    request.validated ??= {}
    request.validated[source] = result.data

    return next()
  }
}
