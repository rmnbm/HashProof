/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 */
async function rootRoutes(fastify) {
  fastify.get('/', async (_request, _reply) => {
    return {
      name: 'HashProof API',
      status: 'ok',
      endpoints: {
        fingerprints: '/api/fingerprints',
        stats: '/api/fingerprints/stats',
      },
    }
  })
}

export default rootRoutes
