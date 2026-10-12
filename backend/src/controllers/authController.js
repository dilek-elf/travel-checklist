import bcrypt from 'bcryptjs'
import { randomBytes } from 'node:crypto'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'

const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error('JWT_SECRET is required.')
}

function createRecoveryCode() {
  return randomBytes(8)
    .toString('hex')
    .toUpperCase()
    .match(/.{1,4}/g)
    .join('-')
}

function normalizeRecoveryCode(code) {
  return code.trim().toUpperCase()
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

  let recoveryCode
  if (!user.recoveryCodeHash) {
    recoveryCode = createRecoveryCode()
    await prisma.user.update({
      where: { id: user.id },
      data: { recoveryCodeHash: bcrypt.hashSync(recoveryCode, 10) },
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
    ...(recoveryCode ? { recoveryCode } : {}),
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
  const recoveryCode = createRecoveryCode()
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      recoveryCodeHash: bcrypt.hashSync(recoveryCode, 10),
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  })

  return response.status(201).json({ ...user, recoveryCode })
}

export async function resetPassword(request, response) {
  const { email, recoveryCode, newPassword } = request.validated.body
  const user = await prisma.user.findUnique({ where: { email } })
  const codeMatches = user?.recoveryCodeHash
    ? bcrypt.compareSync(normalizeRecoveryCode(recoveryCode), user.recoveryCodeHash)
    : false

  if (!user || !codeMatches) {
    return response.status(400).json({
      message: 'The email or recovery code is incorrect.',
    })
  }

  const newRecoveryCode = createRecoveryCode()
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: bcrypt.hashSync(newPassword, 10),
      recoveryCodeHash: bcrypt.hashSync(newRecoveryCode, 10),
    },
  })

  return response.json({
    message: 'Password reset successfully.',
    recoveryCode: newRecoveryCode,
  })
}

export async function regenerateRecoveryCode(request, response) {
  const recoveryCode = createRecoveryCode()
  await prisma.user.update({
    where: { id: request.userId },
    data: { recoveryCodeHash: bcrypt.hashSync(recoveryCode, 10) },
  })

  return response.json({ recoveryCode })
}
