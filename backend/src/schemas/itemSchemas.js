import { z } from 'zod'

const itemTextSchema = z
  .string()
  .trim()
  .min(1, 'The item text is required.')
  .max(200, 'The item text must be 200 characters or fewer.')

export const createItemSchema = z
  .object({
    text: itemTextSchema,
  })
  .strict()

export const updateItemSchema = z
  .object({
    text: itemTextSchema.optional(),
    isPacked: z.boolean().optional(),
  })
  .strict()
  .refine((data) => data.text !== undefined || data.isPacked !== undefined, {
    message: 'Provide text or isPacked to update the item.',
  })

export const itemIdSchema = z.object({
  id: z.coerce
    .number({ error: 'The item ID is invalid.' })
    .int('The item ID is invalid.')
    .positive('The item ID is invalid.'),
})
