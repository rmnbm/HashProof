import process from 'node:process'

const clientOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)

export default {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://stan:stan@localhost:35115/myapp',
  appBaseUrl: process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
  clientOrigins,
}
