import { Router } from 'express'
import { register } from '../controllers/authController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { registerSchema } from '../schemas/authSchemas.js'

const authRouter = Router()

authRouter.post(
  '/register',
  validate(registerSchema, 'body'),
  asyncHandler(register),
)

export default authRouter
