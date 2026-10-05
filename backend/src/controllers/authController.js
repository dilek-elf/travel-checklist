import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'

const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error('JWT_SECRET is required.')
}

export async function login(request, response) {
  const { email, password } = request.validated.body

  const user = await prisma.user.findUnique({ where: { email } })
  const passwordMatches = user
    ? bcrypt.compareSync(password, user.passwordHash)
    : false

  if (!user || !passwordMatches) {
    return response.status(401).json({
      message: 'Email or password is incorrect.',
    })
  }

  const token = jwt.sign({ userId: user.id }, jwtSecret, {
    expiresIn: '1h',
  })

  return response.json({
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  })
}

export async function register(request, response) {
  const { email, password } = request.validated.body

  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    return response.status(409).json({
      message: 'An account with this email already exists.',
    })
  }

  const passwordHash = bcrypt.hashSync(password, 10)
  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  })

  return response.status(201).json(user)
}
