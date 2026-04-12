import mongoose from 'mongoose'

const { Schema } = mongoose

export const fingerprintCategories = [
  'Contrat',
  'Rapport',
  'Note',
  'Code',
  'Autre',
]

const fingerprintSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80,
  },
  ownerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 60,
  },
  category: {
    type: String,
    enum: fingerprintCategories,
    required: true,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 180,
    default: '',
  },
  sourcePreview: {
    type: String,
    required: true,
    maxlength: 180,
  },
  characterCount: {
    type: Number,
    required: true,
    min: 1,
  },
  algorithm: {
    type: String,
    default: 'SHA-256',
  },
  fingerprint: {
    type: String,
    required: true,
    minlength: 64,
    maxlength: 64,
  },
}, {
  timestamps: true,
})

export default mongoose.model('FingerprintRecord', fingerprintSchema)
