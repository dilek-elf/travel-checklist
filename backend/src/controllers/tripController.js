import prisma from '../lib/prisma.js'

export async function getTrips(request, response) {
  const trips = await prisma.trip.findMany({
    where: { userId: request.userId },
    orderBy: { createdAt: 'desc' },
  })

  response.json(trips)
}

export async function createTrip(request, response) {
  const { name, destination } = request.validated.body

  const trip = await prisma.trip.create({
    data: { name, destination, userId: request.userId },
  })

  return response.status(201).json(trip)
}
