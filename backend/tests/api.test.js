import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import app from '../src/app.js'
import prisma from '../src/lib/prisma.js'

const password = 'passport123'

async function registerAndLogin(email) {
  await request(app).post('/api/auth/register').send({ email, password })

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email, password })

  return loginResponse.body
}

function authorization(token) {
  return `Bearer ${token}`
}

beforeAll(() => {
  if (!process.env.DATABASE_URL?.includes('travel_checklist_test')) {
    throw new Error('Automated tests require the travel_checklist_test database.')
  }
})

beforeEach(async () => {
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.user.deleteMany()
  await prisma.$disconnect()
})

describe('public API routes', () => {
  test('returns the API health status', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Travel Checklist API is running')
  })

  test('registers a user and stores only a password hash', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'Traveller@Example.com',
      password,
    })

    expect(response.status).toBe(201)
    expect(response.body.email).toBe('traveller@example.com')
    expect(response.body).not.toHaveProperty('password')
    expect(response.body).not.toHaveProperty('passwordHash')

    const savedUser = await prisma.user.findUnique({
      where: { email: 'traveller@example.com' },
    })

    expect(savedUser.passwordHash).not.toBe(password)
    expect(bcrypt.compareSync(password, savedUser.passwordHash)).toBe(true)
  })

  test('rejects invalid registration and duplicate email addresses', async () => {
    const invalidResponse = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'short' })

    expect(invalidResponse.status).toBe(400)

    await request(app)
      .post('/api/auth/register')
      .send({ email: 'traveller@example.com', password })

    const duplicateResponse = await request(app)
      .post('/api/auth/register')
      .send({ email: 'traveller@example.com', password })

    expect(duplicateResponse.status).toBe(409)
  })

  test('logs in with correct credentials and returns a valid JWT', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'traveller@example.com', password })

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'traveller@example.com', password })

    expect(response.status).toBe(200)
    expect(typeof response.body.token).toBe('string')
    expect(response.body.user.email).toBe('traveller@example.com')

    const payload = jwt.verify(response.body.token, process.env.JWT_SECRET)
    expect(payload.userId).toBe(response.body.user.id)
    expect(payload.exp - payload.iat).toBe(3600)
  })

  test('rejects incorrect login credentials without returning a token', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'traveller@example.com', password })

    const incorrectPassword = await request(app)
      .post('/api/auth/login')
      .send({ email: 'traveller@example.com', password: 'wrong-password' })
    const unknownEmail = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown@example.com', password })

    expect(incorrectPassword.status).toBe(401)
    expect(incorrectPassword.body).not.toHaveProperty('token')
    expect(unknownEmail.status).toBe(401)
    expect(unknownEmail.body).not.toHaveProperty('token')
  })

  test('returns a safe error for malformed JSON', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send('{"email":')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: 'The request body contains invalid JSON.',
    })
  })
})

describe('protected trip routes', () => {
  test('rejects missing and invalid authentication tokens', async () => {
    const missingToken = await request(app).get('/api/trips')
    const invalidToken = await request(app)
      .get('/api/trips')
      .set('Authorization', 'Bearer invalid-token')

    expect(missingToken.status).toBe(401)
    expect(invalidToken.status).toBe(401)
  })

  test('creates, searches, and paginates only the user\'s trips', async () => {
    const owner = await registerAndLogin('owner@example.com')
    const otherUser = await registerAndLogin('other@example.com')

    for (const destination of ['Berlin', 'Munich']) {
      await request(app)
        .post('/api/trips')
        .set('Authorization', authorization(owner.token))
        .send({ name: `Alpine ${destination}`, destination })
    }

    await request(app)
      .post('/api/trips')
      .set('Authorization', authorization(otherUser.token))
      .send({ name: 'Alpine Private', destination: 'Vienna' })

    const response = await request(app)
      .get('/api/trips?search=alpine&page=1&limit=1')
      .set('Authorization', authorization(owner.token))

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveLength(1)
    expect(response.body.data[0].userId).toBe(owner.user.id)
    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 1,
      total: 2,
      totalPages: 2,
    })
  })

  test('allows trip CRUD only for the trip owner', async () => {
    const owner = await registerAndLogin('owner@example.com')
    const otherUser = await registerAndLogin('other@example.com')

    const createResponse = await request(app)
      .post('/api/trips')
      .set('Authorization', authorization(owner.token))
      .send({ name: 'Summer Holiday', destination: 'Spain' })
    const tripId = createResponse.body.id

    const otherRead = await request(app)
      .get(`/api/trips/${tripId}`)
      .set('Authorization', authorization(otherUser.token))
    const ownerUpdate = await request(app)
      .patch(`/api/trips/${tripId}`)
      .set('Authorization', authorization(owner.token))
      .send({ destination: 'Portugal' })
    const otherDelete = await request(app)
      .delete(`/api/trips/${tripId}`)
      .set('Authorization', authorization(otherUser.token))
    const ownerDelete = await request(app)
      .delete(`/api/trips/${tripId}`)
      .set('Authorization', authorization(owner.token))

    expect(createResponse.status).toBe(201)
    expect(otherRead.status).toBe(404)
    expect(ownerUpdate.status).toBe(200)
    expect(ownerUpdate.body.destination).toBe('Portugal')
    expect(otherDelete.status).toBe(404)
    expect(ownerDelete.status).toBe(204)
  })
})

describe('protected checklist item routes', () => {
  test('filters items and allows changes only for the trip owner', async () => {
    const owner = await registerAndLogin('owner@example.com')
    const otherUser = await registerAndLogin('other@example.com')

    const tripResponse = await request(app)
      .post('/api/trips')
      .set('Authorization', authorization(owner.token))
      .send({ name: 'City Break', destination: 'Paris' })
    const tripId = tripResponse.body.id

    const passportResponse = await request(app)
      .post(`/api/trips/${tripId}/items`)
      .set('Authorization', authorization(owner.token))
      .send({ text: 'Passport' })
    const passportId = passportResponse.body.id

    await request(app)
      .post(`/api/trips/${tripId}/items`)
      .set('Authorization', authorization(owner.token))
      .send({ text: 'Sunglasses' })

    const ownerUpdate = await request(app)
      .patch(`/api/items/${passportId}`)
      .set('Authorization', authorization(owner.token))
      .send({ isPacked: true })
    const packedItems = await request(app)
      .get(`/api/trips/${tripId}/items?isPacked=true`)
      .set('Authorization', authorization(owner.token))
    const unpackedItems = await request(app)
      .get(`/api/trips/${tripId}/items?isPacked=false`)
      .set('Authorization', authorization(owner.token))
    const otherUpdate = await request(app)
      .patch(`/api/items/${passportId}`)
      .set('Authorization', authorization(otherUser.token))
      .send({ text: 'Changed by another user' })
    const otherDelete = await request(app)
      .delete(`/api/items/${passportId}`)
      .set('Authorization', authorization(otherUser.token))
    const ownerDelete = await request(app)
      .delete(`/api/items/${passportId}`)
      .set('Authorization', authorization(owner.token))

    expect(ownerUpdate.status).toBe(200)
    expect(packedItems.status).toBe(200)
    expect(packedItems.body).toHaveLength(1)
    expect(packedItems.body[0].text).toBe('Passport')
    expect(unpackedItems.body).toHaveLength(1)
    expect(unpackedItems.body[0].text).toBe('Sunglasses')
    expect(otherUpdate.status).toBe(404)
    expect(otherDelete.status).toBe(404)
    expect(ownerDelete.status).toBe(204)
  })
})
