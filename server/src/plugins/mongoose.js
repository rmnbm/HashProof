import mongoose from 'mongoose'

import config from '../config.js'

const CREDENTIALS_PREFIX = /^.*@/
const MONGO_SCHEME = /^mongodb(?:\+srv)?:\/\//

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
async function mongoosePlugin(fastify) {
  // Log only the host, never the credentials.
  const host = config.mongoUri.replace(CREDENTIALS_PREFIX, '').replace(MONGO_SCHEME, '').split('/')[0]
  fastify.log.info(`Connecting to MongoDB (${host})...`)

  try {
    // Fail before Fastify's 10s plugin timeout so the real cause is logged.
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 7000 })
  } catch (err) {
    fastify.log.error(`MongoDB connection failed: ${err.message}`)
    throw err
  }
  fastify.log.info('Connected to MongoDB')

  fastify.addHook('onClose', async () => {
    await mongoose.connection.close()
  })
}

export default mongoosePlugin
