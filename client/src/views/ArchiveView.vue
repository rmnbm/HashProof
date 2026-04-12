<script setup>
import { reactive, onMounted } from 'vue'

import FingerprintCard from '../components/FingerprintCard.vue'
import { useFingerprintsStore } from '../stores/fingerprints.js'

const store = useFingerprintsStore()

const filters = reactive({
  search: '',
  category: '',
})

async function loadArchive() {
  await store.loadItems({
    limit: 18,
    search: filters.search,
    category: filters.category,
  })
}

async function deleteRecord(record) {
  const confirmed = window.confirm(`Supprimer l’empreinte "${record.title}" ?`)

  if (!confirmed) {
    return
  }

  await store.deleteItem(String(record._id))
}

onMounted(async () => {
  await loadArchive()
})
</script>

<template>
  <section class="section-heading">
    <div>
      <p class="eyebrow">Archive</p>
      <h1>Consulter les empreintes enregistrées</h1>
    </div>
  </section>

  <section class="panel filters-panel">
    <form class="filters-form" @submit.prevent="loadArchive">
      <label>
        Recherche
        <input v-model="filters.search" type="text" placeholder="Titre, responsable ou note" />
      </label>

      <label>
        Catégorie
        <select v-model="filters.category">
          <option value="">Toutes</option>
          <option v-for="category in store.categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </label>

      <button class="button button--primary" type="submit">
        Filtrer
      </button>
    </form>
  </section>

  <p v-if="store.errorMessage" class="feedback feedback--error">
    {{ store.errorMessage }}
  </p>

  <section v-if="store.items.length" class="records-grid">
    <FingerprintCard
      v-for="item in store.items"
      :key="item._id"
      :fingerprint="item"
      @delete="deleteRecord"
    />
  </section>

  <article v-else-if="!store.isLoading" class="empty-state">
    <h3>Aucun résultat</h3>
    <p>Modifier les filtres ou créer une nouvelle empreinte pour alimenter l’archive.</p>
  </article>
</template>
