<script setup>
import { computed, onMounted } from 'vue'

import FingerprintCard from '../components/FingerprintCard.vue'
import { useFingerprintsStore } from '../stores/fingerprints.js'

const store = useFingerprintsStore()

const latestItems = computed(() => store.items.slice(0, 3))
const topCategory = computed(() => store.stats.categoryBreakdown[0]?.category || 'Aucune')

onMounted(async () => {
  await Promise.all([
    store.loadStats(),
    store.loadItems({ limit: 3 }),
  ])
})
</script>

<template>
  <section class="hero">
    <div class="hero__content">
      <p class="eyebrow">Registre d’empreintes cryptographiques</p>
      <h1>Une application web pour prouver l’intégrité d’un contenu.</h1>
      <p class="hero__text">
        HashProof calcule une empreinte SHA-256 à partir d’un texte, conserve la trace
        de l’enregistrement dans MongoDB et permet une vérification ultérieure depuis
        l’interface Vue.
      </p>

      <div class="hero__actions">
        <RouterLink to="/create" class="button button--primary">
          Créer une empreinte
        </RouterLink>
        <RouterLink to="/archive" class="button button--ghost">
          Explorer l’archive
        </RouterLink>
      </div>
    </div>

    <div class="hero__panel">
      <div class="stat-grid">
        <article class="stat-card">
          <span>Total</span>
          <strong>{{ store.stats.totalRecords }}</strong>
        </article>
        <article class="stat-card">
          <span>Catégories</span>
          <strong>{{ store.stats.categoriesUsed }}</strong>
        </article>
        <article class="stat-card">
          <span>Top catégorie</span>
          <strong>{{ topCategory }}</strong>
        </article>
        <article class="stat-card">
          <span>Algorithme</span>
          <strong>SHA-256</strong>
        </article>
      </div>
    </div>
  </section>

  <section class="section-grid">
    <article class="panel">
      <p class="eyebrow">Fonctionnement</p>
      <h2>Une preuve simple en trois étapes</h2>
      <ol class="timeline">
        <li>Soumettre un texte avec des métadonnées via un formulaire Vue.</li>
        <li>Calculer et enregistrer l’empreinte côté serveur avec Fastify.</li>
        <li>Vérifier plus tard qu’un contenu correspond exactement à l’original.</li>
      </ol>
    </article>
  </section>

  <section class="records-section">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Dernieres empreintes</p>
        <h2>Archive récente</h2>
      </div>
      <RouterLink to="/archive" class="button button--ghost">
        Voir toute l’archive
      </RouterLink>
    </div>

    <p v-if="store.errorMessage" class="feedback feedback--error">
      {{ store.errorMessage }}
    </p>

    <div v-if="latestItems.length" class="records-grid">
      <FingerprintCard
        v-for="item in latestItems"
        :key="item._id"
        :fingerprint="item"
      />
    </div>
    <article v-else class="empty-state">
      <h3>Aucune empreinte enregistrée</h3>
      <p>Le registre est vide. Une première création activera l’archive et les statistiques.</p>
    </article>
  </section>
</template>
