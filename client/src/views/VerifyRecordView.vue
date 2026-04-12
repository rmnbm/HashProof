<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useFingerprintsStore } from '../stores/fingerprints.js'

const route = useRoute()
const store = useFingerprintsStore()

const record = ref(null)
const candidateText = ref('')
const verificationResult = ref(null)
const isChecking = ref(false)
const localError = ref('')

const formattedDate = computed(() => {
  if (!record.value) {
    return ''
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(record.value.createdAt))
})

async function loadRecord() {
  localError.value = ''

  try {
    record.value = await store.loadItem(route.params.id)
  } catch (error) {
    localError.value = error.message
  }
}

async function handleVerification() {
  if (!record.value) {
    return
  }

  isChecking.value = true
  localError.value = ''

  try {
    verificationResult.value = await store.verifyItem(record.value._id, candidateText.value)
  } catch (error) {
    localError.value = error.message
  } finally {
    isChecking.value = false
  }
}

onMounted(loadRecord)
</script>

<template>
  <section class="verify-layout">
    <article class="panel">
      <p class="eyebrow">Vérification</p>
      <h1>Comparer un texte à l’empreinte de référence</h1>

      <p v-if="localError" class="feedback feedback--error">
        {{ localError }}
      </p>

      <template v-if="record">
        <dl class="detail-grid">
          <div>
            <dt>Titre</dt>
            <dd>{{ record.title }}</dd>
          </div>
          <div>
            <dt>Responsable</dt>
            <dd>{{ record.ownerName }}</dd>
          </div>
          <div>
            <dt>Catégorie</dt>
            <dd>{{ record.category }}</dd>
          </div>
          <div>
            <dt>Création</dt>
            <dd>{{ formattedDate }}</dd>
          </div>
        </dl>

        <p class="reference-hash">
          <span>Empreinte de référence</span>
          <code>{{ record.fingerprint }}</code>
        </p>

        <form class="record-form" @submit.prevent="handleVerification">
          <label>
            Texte à vérifier
            <textarea
              v-model="candidateText"
              rows="12"
              placeholder="Coller ici le texte à comparer"
            />
          </label>

          <button class="button button--primary button--block" type="submit" :disabled="isChecking">
            {{ isChecking ? 'Vérification...' : 'Vérifier la correspondance' }}
          </button>
        </form>
      </template>
    </article>

    <article class="panel panel--aside">
      <p class="eyebrow">Diagnostic</p>
      <h2>Résultat de la comparaison</h2>

      <article
        v-if="verificationResult"
        :class="verificationResult.matches ? 'result-card result-card--success' : 'result-card result-card--danger'"
      >
        <strong>
          {{ verificationResult.matches ? 'Correspondance validée' : 'Correspondance invalide' }}
        </strong>
        <p>
          {{
            verificationResult.matches
              ? 'Le texte fourni produit exactement la même empreinte que le contenu de référence.'
              : 'Le texte fourni ne correspond pas au contenu qui a servi lors de l’enregistrement.'
          }}
        </p>
        <code>{{ verificationResult.candidateFingerprint }}</code>
      </article>

      <article v-else class="empty-state empty-state--soft">
        <h3>Vérification en attente</h3>
        <p>Le résultat de comparaison apparaîtra ici après l’envoi du formulaire.</p>
      </article>
    </article>
  </section>
</template>
