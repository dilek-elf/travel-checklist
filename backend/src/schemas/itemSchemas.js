import { z } from 'zod'

const itemTextSchema = z
  .string()
  .trim()
  .min(1, 'The item text is required.')
  .max(200, 'The item text must be 200 characters or fewer.')

const itemCategorySchema = z.enum([
  'Documents',
  'Clothes',
  'Toiletries',
  'Electronics',
  'Health',
  'Travel gear',
  'Pet',
  'Other',
])

export const createItemSchema = z
  .object({
    text: itemTextSchema,
    category: itemCategorySchema.optional(),
  })
  .strict()

export const updateItemSchema = z
  .object({
    text: itemTextSchema.optional(),
    category: itemCategorySchema.optional(),
    isPacked: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Provide text, category, or isPacked to update the item.',
  })

export const itemIdSchema = z.object({
  id: z.coerce
    .number({ error: 'The item ID is invalid.' })
    .int('The item ID is invalid.')
    .positive('The item ID is invalid.'),
})

export const itemListQuerySchema = z
  .object({
    isPacked: z
      .enum(['true', 'false'], {
        error: 'isPacked must be true or false.',
      })
      .transform((value) => value === 'true')
      .optional(),
  })
  .strict()
