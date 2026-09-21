import { z } from 'zod'

export const createTripSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'The trip name is required.')
      .max(100, 'The trip name must be 100 characters or fewer.'),
    destination: z
      .string()
      .trim()
      .min(1, 'The destination is required.')
      .max(100, 'The destination must be 100 characters or fewer.'),
  })
  .strict()

export const tripIdSchema = z.object({
  tripId: z.coerce
    .number({ error: 'The trip ID is invalid.' })
    .int('The trip ID is invalid.')
    .positive('The trip ID is invalid.'),
})
