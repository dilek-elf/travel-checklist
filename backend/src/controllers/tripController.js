import prisma from '../lib/prisma.js'

export async function getTrips(request, response) {
  const { search, page, limit } = request.validated.query
  const where = {
    userId: request.userId,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { destination: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  const [trips, total] = await prisma.$transaction([
    prisma.trip.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.trip.count({ where }),
  ])

  return response.json({
    data: trips,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export async function createTrip(request, response) {
  const { name, destination } = request.validated.body

  const trip = await prisma.trip.create({
    data: { name, destination, userId: request.userId },
  })

  return response.status(201).json(trip)
}

export async function getTrip(request, response) {
  const { id } = request.validated.params

  const trip = await prisma.trip.findFirst({
    where: { id, userId: request.userId },
  })

  if (!trip) {
    return response.status(404).json({ message: 'Trip not found.' })
  }

  return response.json(trip)
}

export async function updateTrip(request, response) {
  const { id } = request.validated.params
  const data = request.validated.body

  const existingTrip = await prisma.trip.findFirst({
    where: { id, userId: request.userId },
  })

  if (!existingTrip) {
    return response.status(404).json({ message: 'Trip not found.' })
  }

  const trip = await prisma.trip.update({
    where: { id },
    data,
  })

  return response.json(trip)
}

export async function deleteTrip(request, response) {
  const { id } = request.validated.params

  const existingTrip = await prisma.trip.findFirst({
    where: { id, userId: request.userId },
  })

  if (!existingTrip) {
    return response.status(404).json({ message: 'Trip not found.' })
  }

  await prisma.trip.delete({ where: { id } })

  return response.status(204).send()
}
