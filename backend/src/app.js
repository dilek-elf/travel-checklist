import cors from 'cors'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import { authenticate } from './middleware/authenticate.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import authRouter from './routes/authRoutes.js'
import itemRouter from './routes/itemRoutes.js'
import tripRouter from './routes/tripRoutes.js'

const app = express()
const clientOrigin = process.env.CLIENT_ORIGIN
const rateLimitMax = Number(process.env.RATE_LIMIT_MAX) || 100

if (!clientOrigin) {
  throw new Error('CLIENT_ORIGIN is required.')
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: rateLimitMax,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: (request) => request.method === 'OPTIONS',
  message: { message: 'Too many requests. Please try again later.' },
})

app.disable('x-powered-by')
app.use(
  cors({
    origin: clientOrigin,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)
app.use('/api', apiLimiter)
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (_request, response) => {
  response.json({ message: 'Travel Checklist API is running' })
})

app.use('/api/auth', authRouter)
app.use('/api/trips', authenticate, tripRouter)
app.use('/api/items', authenticate, itemRouter)

app.use(notFound)
app.use(errorHandler)

export default app
