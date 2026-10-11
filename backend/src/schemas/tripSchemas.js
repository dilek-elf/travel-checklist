import { z } from 'zod'

const tripTypeSchema = z.enum([
  'Weekend',
  'Business',
  'Family vacation',
  'Spring break',
  'Tech work',
  'Camping',
  'Road trip',
])
const seasonSchema = z.enum([
  'Spring',
  'Summer',
  'Autumn',
  'Winter',
  'All seasons',
])
const travelGroupSchema = z.enum(['Solo', 'Couple', 'Family', 'Friends/group'])
const transportSchema = z.enum([
  'Car',
  'Motorcycle',
  'Camper van/RV',
  'Bus',
  'Train',
  'Plane',
  'Cruise ship',
])
const travelScopeSchema = z.enum(['Domestic', 'International'])
const accommodationSchema = z.enum([
  'Hotel',
  'Holiday apartment',
  'Family/friends',
  'Camping',
  'Camper van',
])
const activitySchema = z.enum([
  'Beach/swimming',
  'Hiking',
  'Skiing',
  'Formal event',
  'Sports/gym',
  'Remote work',
  'Photography',
])
const luggageSchema = z.enum([
  'Backpack only',
  'Carry-on',
  'Checked suitcase',
  'Car luggage',
])
const personalNeedSchema = z.enum([
  'Medication',
  'Accessibility equipment',
  'Glasses/contact lenses',
  'Menstrual products',
  'Pregnancy essentials',
  'Makeup',
  'Shaving/grooming',
  'Haircare',
])
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a valid date.')
  .nullable()

const countSchema = z
  .number({ error: 'Traveller counts must be whole numbers.' })
  .int('Traveller counts must be whole numbers.')
  .min(0, 'Traveller counts cannot be negative.')
  .max(20, 'Traveller counts cannot be more than 20.')

const tripPreferencesSchema = {
  tripType: tripTypeSchema.optional(),
  season: seasonSchema.optional(),
  durationDays: z
    .number({ error: 'The duration must be between 1 and 60 days.' })
    .int('The duration must be a whole number of days.')
    .min(1, 'The trip must be at least 1 day.')
    .max(60, 'The trip cannot be longer than 60 days.')
    .optional(),
  travelGroup: travelGroupSchema.optional(),
  hasPet: z.boolean().optional(),
  petType: z.enum(['Dog', 'Cat', 'Other']).nullable().optional(),
  transport: transportSchema.optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  travelScope: travelScopeSchema.optional(),
  accommodation: accommodationSchema.optional(),
  adultCount: countSchema.optional(),
  babyCount: countSchema.optional(),
  toddlerCount: countSchema.optional(),
  childCount: countSchema.optional(),
  teenCount: countSchema.optional(),
  activities: z.array(activitySchema).max(7).optional(),
  luggage: luggageSchema.optional(),
  hasLaundry: z.boolean().optional(),
  personalNeeds: z.array(personalNeedSchema).max(8).optional(),
}

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
    ...tripPreferencesSchema,
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
    ...tripPreferencesSchema,
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: 'Provide at least one trip detail to update.' },
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
