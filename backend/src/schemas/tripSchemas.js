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

export const updateTripSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'The trip name is required.')
      .max(100, 'The trip name must be 100 characters or fewer.')
      .optional(),
    destination: z
      .string()
      .trim()
      .min(1, 'The destination is required.')
      .max(100, 'The destination must be 100 characters or fewer.')
      .optional(),
  })
  .strict()
  .refine(
    (data) => data.name !== undefined || data.destination !== undefined,
    { message: 'Provide a name or destination to update the trip.' },
  )

export const tripResourceIdSchema = z.object({
  id: z.coerce
    .number({ error: 'The trip ID is invalid.' })
    .int('The trip ID is invalid.')
    .positive('The trip ID is invalid.'),
})

export const tripListQuerySchema = z
  .object({
    search: z
      .string()
      .trim()
      .max(100, 'The search text must be 100 characters or fewer.')
      .optional(),
    page: z.coerce
      .number({ error: 'The page must be a positive whole number.' })
      .int('The page must be a positive whole number.')
      .positive('The page must be a positive whole number.')
      .default(1),
    limit: z.coerce
      .number({ error: 'The limit must be a positive whole number.' })
      .int('The limit must be a positive whole number.')
      .min(1, 'The limit must be at least 1.')
      .max(50, 'The limit must be 50 or fewer.')
      .default(10),
  })
  .strict()

export const tripIdSchema = z.object({
  tripId: z.coerce
    .number({ error: 'The trip ID is invalid.' })
    .int('The trip ID is invalid.')
    .positive('The trip ID is invalid.'),
})
