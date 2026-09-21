import { Router } from 'express'
import { deleteItem, updateItem } from '../controllers/itemController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { itemIdSchema, updateItemSchema } from '../schemas/itemSchemas.js'

const itemRouter = Router()

itemRouter.patch(
  '/:id',
  validate(itemIdSchema, 'params'),
  validate(updateItemSchema, 'body'),
  asyncHandler(updateItem),
)
itemRouter.delete(
  '/:id',
  validate(itemIdSchema, 'params'),
  asyncHandler(deleteItem),
)

export default itemRouter
