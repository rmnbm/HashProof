import Fastify from 'fastify'

import config from './config.js'
import envToLogger from './logger.js'
import mongoosePlugin from './plugins/mongoose.js'
import fingerprintsRoutes from './routes/fingerprints-routes.js'
import rootRoutes from './rootRoute.js'

function getAllowedOrigin(origin) {
  if (!origin) {
    return null
  }

  if (config.clientOrigins.includes('*')) {
    return origin
  }

  return config.clientOrigins.includes(origin) ? origin : null
}

async function buildApp() {
  const fastify = Fastify({
    logger: envToLogger[config.env] ?? true,
  })

  await fastify.register(mongoosePlugin)

  // Keep the API callable from the local frontend and the deployed frontend.
  fastify.addHook('onRequest', async (request, reply) => {
    const allowedOrigin = getAllowedOrigin(request.headers.origin)

    if (allowedOrigin) {
      reply.header('Access-Control-Allow-Origin', allowedOrigin)
      reply.header('Vary', 'Origin')
    }

    reply.header('Access-Control-Allow-Credentials', 'true')
    reply.header('Access-Control-Allow-Headers', 'Content-Type')
    reply.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')

    if (request.method === 'OPTIONS') {
      return reply.code(204).send()
    }
  })

  fastify.register(fingerprintsRoutes, { prefix: '/api/fingerprints' })
  fastify.register(rootRoutes)

  return fastify
}

export default buildApp
