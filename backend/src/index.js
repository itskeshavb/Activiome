require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const checkJwt = require('./middleware/auth')
const clipsRouter = require('./routes/clips')
const tagsRouter = require('./routes/tags')
const uploadRouter = require('./routes/upload')

const app = express()
const PORT = process.env.PORT || 3001

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(helmet())
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}))
app.use(morgan('combined'))
app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// Upload route — no JWT required, uses user_id validation instead
app.use('/upload', uploadRouter)

// All routes below require a valid Auth0 JWT
app.use(checkJwt)

app.use('/clips', clipsRouter)
app.use('/tags', tagsRouter)

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})
