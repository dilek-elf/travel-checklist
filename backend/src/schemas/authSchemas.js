import { z } from 'zod'

export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Enter a valid email address.'),
    password: z
      .string()
      .min(8, 'The password must contain at least 8 characters.')
      .max(72, 'The password must contain 72 characters or fewer.'),
  })
  .strict()

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Enter a valid email address.'),
    password: z
      .string()
      .min(1, 'The password is required.')
      .max(72, 'The password must contain 72 characters or fewer.'),
  })
  .strict()

export const resetPasswordSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
    recoveryCode: z
      .string()
      .trim()
      .min(1, 'The recovery code is required.')
      .max(32, 'The recovery code is invalid.'),
    newPassword: z
      .string()
      .min(8, 'The password must contain at least 8 characters.')
      .max(72, 'The password must contain 72 characters or fewer.'),
  })
  .strict()
