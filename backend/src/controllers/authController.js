import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma.js'

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
