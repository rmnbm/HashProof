import { createHash } from 'node:crypto'

import mongoose from 'mongoose'

import FingerprintRecord, { fingerprintCategories } from '../models/fingerprint-schema.js'

function normalizeSourceText(text) {
  // Normalize line endings so the same content hashes identically across platforms.
  return text.replace(/\r\n/g, '\n')
}

function computeFingerprint(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex')
}

function buildPreview(text) {
  return text.length > 160 ? `${text.slice(0, 157)}...` : text
}

function validateRecordPayload(payload) {
  const title = payload.title?.trim()
  const ownerName = payload.ownerName?.trim()
  const category = payload.category?.trim()
  const notes = payload.notes?.trim() || ''
  const sourceText = payload.sourceText || ''

  if (!title || !ownerName || !category || !sourceText.trim()) {
    return { error: 'Titre, auteur, catégorie et texte source requis.' }
  }

  if (!fingerprintCategories.includes(category)) {
    return { error: 'Catégorie invalide.' }
  }

  const normalizedSourceText = normalizeSourceText(sourceText)

  return {
    value: {
      title,
      ownerName,
      category,
      notes,
      normalizedSourceText,
    },
  }
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

function serializeRecord(record) {
  if (!record) {
    return record
  }

  return {
    ...record,
    _id: String(record._id),
  }
}

/**
 *
 * @param {import('fastify').FastifyInstance} app
 */
async function fingerprintsRoutes(app) {
  app.get('/stats', async (_request, reply) => {
    const [totalRecords, latestRecord, categoryBreakdown] = await Promise.all([
      FingerprintRecord.countDocuments(),
      FingerprintRecord.findOne().sort({ createdAt: -1 }).select('createdAt').lean(),
      FingerprintRecord.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
      ]),
    ])

    return reply.send({
      totalRecords,
      latestRecordAt: latestRecord?.createdAt ?? null,
      categoriesUsed: categoryBreakdown.length,
      categoryBreakdown: categoryBreakdown.map(item => ({
        category: item._id,
        count: item.count,
      })),
    })
  })

  app.get('/', async (request, reply) => {
    const requestedLimit = Number(request.query.limit) || 12
    const limit = Math.min(Math.max(requestedLimit, 1), 50)
    const search = request.query.search?.trim()
    const category = request.query.category?.trim()

    const filters = {}

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ]
    }

    if (category && fingerprintCategories.includes(category)) {
      filters.category = category
    }

    const items = await FingerprintRecord.find(filters)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    return reply.send({
      items: items.map(serializeRecord),
      categories: fingerprintCategories,
    })
  })

  app.get('/:id', async (request, reply) => {
    const { id } = request.params

    if (!isValidObjectId(id)) {
      return reply.status(400).send({ error: 'Identifiant invalide.' })
    }

    const item = await FingerprintRecord.findById(id).lean()

    if (!item) {
      return reply.status(404).send({ error: 'Empreinte introuvable.' })
    }

    return reply.send({ item: serializeRecord(item) })
  })

  app.post('/', async (request, reply) => {
    const validation = validateRecordPayload(request.body || {})

    if (validation.error) {
      return reply.status(400).send({ error: validation.error })
    }

    const { title, ownerName, category, notes, normalizedSourceText } = validation.value
    const fingerprint = computeFingerprint(normalizedSourceText)

    const item = await FingerprintRecord.create({
      title,
      ownerName,
      category,
      notes,
      sourcePreview: buildPreview(normalizedSourceText),
      characterCount: normalizedSourceText.length,
      fingerprint,
    })

    return reply.status(201).send({ item: serializeRecord(item.toObject()) })
  })

  app.post('/:id/verify', async (request, reply) => {
    const { id } = request.params
    const candidateText = request.body?.candidateText || ''

    if (!isValidObjectId(id)) {
      return reply.status(400).send({ error: 'Identifiant invalide.' })
    }

    if (!candidateText.trim()) {
      return reply.status(400).send({ error: 'Texte à vérifier requis.' })
    }

    const item = await FingerprintRecord.findById(id).lean()

    if (!item) {
      return reply.status(404).send({ error: 'Empreinte introuvable.' })
    }

    const candidateFingerprint = computeFingerprint(normalizeSourceText(candidateText))
    const matches = candidateFingerprint === item.fingerprint

    return reply.send({
      matches,
      candidateFingerprint,
      referenceFingerprint: item.fingerprint,
      checkedAt: new Date().toISOString(),
    })
  })

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params

    if (!isValidObjectId(id)) {
      return reply.status(400).send({ error: 'Identifiant invalide.' })
    }

    const deletedItem = await FingerprintRecord.findByIdAndDelete(id).lean()

    if (!deletedItem) {
      return reply.status(404).send({ error: 'Empreinte introuvable.' })
    }

    return reply.send({ success: true })
  })
}

export default fingerprintsRoutes
