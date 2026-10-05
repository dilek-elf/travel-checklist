import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error('JWT_SECRET is required.')
}

export function authenticate(request, response, next) {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return response.status(401).json({
      message: 'Authentication is required.',
    })
  }

  const token = authorizationHeader.slice('Bearer '.length)

  try {
    const payload = jwt.verify(token, jwtSecret)

    if (typeof payload !== 'object' || !Number.isInteger(payload.userId)) {
      throw new Error('Invalid token payload.')
    }

    request.userId = payload.userId
    return next()
  } catch {
    return response.status(401).json({
      message: 'The authentication token is invalid or expired.',
    })
  }
}
