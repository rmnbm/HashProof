<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useFingerprintsStore } from '../stores/fingerprints.js'

const router = useRouter()
const store = useFingerprintsStore()

const categories = ['Contrat', 'Rapport', 'Note', 'Code', 'Autre']
const isSubmitting = ref(false)
const createdRecord = ref(null)

const form = reactive({
  title: '',
  ownerName: '',
  category: 'Rapport',
  notes: '',
  sourceText: '',
})

async function handleSubmit() {
  isSubmitting.value = true
  store.clearError()

  try {
    createdRecord.value = await store.createItem({ ...form })
    form.title = ''
    form.ownerName = ''
    form.category = 'Rapport'
    form.notes = ''
    form.sourceText = ''
  } finally {
    isSubmitting.value = false
  }
}

async function copyFingerprint() {
  if (!createdRecord.value) {
    return
  }

  await navigator.clipboard.writeText(createdRecord.value.fingerprint)
}
</script>

<template>
  <section class="form-layout">
    <article class="panel panel--form">
      <div class="section-heading section-heading--compact">
        <div>
          <p class="eyebrow">Nouvelle empreinte</p>
          <h1>Enregistrer un contenu</h1>
        </div>
      </div>

      <p class="form-intro">
        Le texte source est envoyé au serveur, transformé en empreinte SHA-256,
        puis stocké avec ses métadonnées dans MongoDB.
      </p>

      <form class="record-form" @submit.prevent="handleSubmit">
        <label>
          Titre
          <input v-model="form.title" type="text" maxlength="80" placeholder="Rapport trimestriel" />
        </label>

        <label>
          Responsable
          <input v-model="form.ownerName" type="text" maxlength="60" placeholder="Nom de l’auteur" />
        </label>

        <label>
          Catégorie
          <select v-model="form.category">
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </label>

        <label>
          Notes
          <input v-model="form.notes" type="text" maxlength="180" placeholder="Contexte ou version" />
        </label>

        <label>
          Texte source
          <textarea
            v-model="form.sourceText"
            rows="10"
            placeholder="Coller ici le contenu à certifier"
          />
        </label>

        <button class="button button--primary button--block" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Enregistrement...' : 'Calculer et enregistrer' }}
        </button>
      </form>

      <p v-if="store.errorMessage" class="feedback feedback--error">
        {{ store.errorMessage }}
      </p>
    </article>

    <article class="panel panel--aside">
      <p class="eyebrow">Resultat</p>
      <h2>Dernière création</h2>

      <article v-if="createdRecord" class="success-card">
        <p class="success-card__title">{{ createdRecord.title }}</p>
        <p class="success-card__subtitle">
          {{ createdRecord.category }} - {{ createdRecord.characterCount }} caractères
        </p>
        <code class="success-card__hash">{{ createdRecord.fingerprint }}</code>

        <div class="success-card__actions">
          <button class="button button--ghost" type="button" @click="copyFingerprint">
            Copier l’empreinte
          </button>
          <button class="button button--primary" type="button" @click="router.push(`/verify/${createdRecord._id}`)">
            Ouvrir la vérification
          </button>
        </div>
      </article>

      <article v-else class="empty-state empty-state--soft">
        <h3>Aucune empreinte calculée</h3>
        <p>Le résumé de création apparaîtra ici après le premier enregistrement.</p>
      </article>
    </article>
  </section>
</template>
