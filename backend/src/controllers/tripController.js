import prisma from '../lib/prisma.js'

export async function getTrips(_request, response) {
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: 'desc' },
  })

  response.json(trips)
}

export async function createTrip(request, response) {
  const { name, destination } = request.validated.body

  const trip = await prisma.trip.create({
    data: { name, destination },
  })

  return response.status(201).json(trip)
}
