import { defineStore } from 'pinia'

import { deleteApi, fetchApi, postApi } from '../lib/api.js'

function buildQuery(params = {}) {
  // Keep list filters encoded in a single place before calling the API.
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value)
    }
  })

  const queryString = searchParams.toString()

  return queryString ? `?${queryString}` : ''
}

export const useFingerprintsStore = defineStore('fingerprints', {
  state: () => ({
    items: [],
    stats: {
      totalRecords: 0,
      latestRecordAt: null,
      categoriesUsed: 0,
      categoryBreakdown: [],
    },
    categories: [],
    isLoading: false,
    errorMessage: '',
  }),
  actions: {
    clearError() {
      this.errorMessage = ''
    },
    async loadStats() {
      try {
        this.stats = await fetchApi('/api/fingerprints/stats')
      } catch (error) {
        this.errorMessage = error.message
      }
    },
    async loadItems(filters = {}) {
      this.isLoading = true
      this.errorMessage = ''

      try {
        const data = await fetchApi(`/api/fingerprints${buildQuery(filters)}`)
        this.items = data.items
        this.categories = data.categories
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },
    async createItem(payload) {
      this.errorMessage = ''

      try {
        const data = await postApi('/api/fingerprints', payload)
        this.items = [data.item, ...this.items]
        await this.loadStats()
        return data.item
      } catch (error) {
        this.errorMessage = error.message
        throw error
      }
    },
    async loadItem(id) {
      const data = await fetchApi(`/api/fingerprints/${id}`)
      return data.item
    },
    async verifyItem(id, candidateText) {
      return postApi(`/api/fingerprints/${id}/verify`, { candidateText })
    },
    async deleteItem(id) {
      this.errorMessage = ''

      try {
        await deleteApi(`/api/fingerprints/${id}`)
        this.items = this.items.filter(item => item._id !== id)
        await this.loadStats()
      } catch (error) {
        this.errorMessage = error.message
        throw error
      }
    },
  },
})
