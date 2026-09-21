import prisma from '../lib/prisma.js'

export async function getItems(request, response) {
  const { tripId } = request.validated.params

  const trip = await prisma.trip.findUnique({ where: { id: tripId } })

  if (!trip) {
    return response.status(404).json({ message: 'Trip not found.' })
  }

  const items = await prisma.checklistItem.findMany({
    where: { tripId },
    orderBy: { createdAt: 'asc' },
  })

  return response.json(items)
}

export async function createItem(request, response) {
  const { tripId } = request.validated.params
  const { text } = request.validated.body

  const trip = await prisma.trip.findUnique({ where: { id: tripId } })

  if (!trip) {
    return response.status(404).json({ message: 'Trip not found.' })
  }

  const item = await prisma.checklistItem.create({
    data: { text, tripId },
  })

  return response.status(201).json(item)
}

export async function updateItem(request, response) {
  const { id } = request.validated.params
  const data = request.validated.body

  const existingItem = await prisma.checklistItem.findUnique({
    where: { id },
  })

  if (!existingItem) {
    return response.status(404).json({ message: 'Item not found.' })
  }

  const item = await prisma.checklistItem.update({
    where: { id },
    data,
  })

  return response.json(item)
}

export async function deleteItem(request, response) {
  const { id } = request.validated.params

  const existingItem = await prisma.checklistItem.findUnique({
    where: { id },
  })

  if (!existingItem) {
    return response.status(404).json({ message: 'Item not found.' })
  }

  await prisma.checklistItem.delete({ where: { id } })

  return response.status(204).send()
}
