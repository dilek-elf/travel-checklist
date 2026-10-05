import { Router } from 'express'
import { login, register } from '../controllers/authController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { loginSchema, registerSchema } from '../schemas/authSchemas.js'

const authRouter = Router()

authRouter.post(
  '/login',
  validate(loginSchema, 'body'),
  asyncHandler(login),
)

authRouter.post(
  '/register',
  validate(registerSchema, 'body'),
  asyncHandler(register),
)

export default authRouter
