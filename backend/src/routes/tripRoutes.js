import { Router } from 'express'
import { createItem, getItems } from '../controllers/itemController.js'
import {
  createTrip,
  deleteTrip,
  getTrip,
  getTrips,
  updateTrip,
} from '../controllers/tripController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { createItemSchema, itemListQuerySchema } from '../schemas/itemSchemas.js'
import {
  createTripSchema,
  tripIdSchema,
  tripListQuerySchema,
  tripResourceIdSchema,
  updateTripSchema,
} from '../schemas/tripSchemas.js'

const tripRouter = Router()

tripRouter.get(
  '/',
  validate(tripListQuerySchema, 'query'),
  asyncHandler(getTrips),
)
tripRouter.post(
  '/',
  validate(createTripSchema, 'body'),
  asyncHandler(createTrip),
)
tripRouter.get(
  '/:id',
  validate(tripResourceIdSchema, 'params'),
  asyncHandler(getTrip),
)
tripRouter.patch(
  '/:id',
  validate(tripResourceIdSchema, 'params'),
  validate(updateTripSchema, 'body'),
  asyncHandler(updateTrip),
)
tripRouter.delete(
  '/:id',
  validate(tripResourceIdSchema, 'params'),
  asyncHandler(deleteTrip),
)
tripRouter.get(
  '/:tripId/items',
  validate(tripIdSchema, 'params'),
  validate(itemListQuerySchema, 'query'),
  asyncHandler(getItems),
)
tripRouter.post(
  '/:tripId/items',
  validate(tripIdSchema, 'params'),
  validate(createItemSchema, 'body'),
  asyncHandler(createItem),
)

export default tripRouter
