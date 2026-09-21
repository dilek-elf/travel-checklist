import { Router } from 'express'
import { createItem, getItems } from '../controllers/itemController.js'
import { createTrip, getTrips } from '../controllers/tripController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { createItemSchema } from '../schemas/itemSchemas.js'
import { createTripSchema, tripIdSchema } from '../schemas/tripSchemas.js'

const tripRouter = Router()

tripRouter.get('/', asyncHandler(getTrips))
tripRouter.post(
  '/',
  validate(createTripSchema, 'body'),
  asyncHandler(createTrip),
)
tripRouter.get(
  '/:tripId/items',
  validate(tripIdSchema, 'params'),
  asyncHandler(getItems),
)
tripRouter.post(
  '/:tripId/items',
  validate(tripIdSchema, 'params'),
  validate(createItemSchema, 'body'),
  asyncHandler(createItem),
)

export default tripRouter
