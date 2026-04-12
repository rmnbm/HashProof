<script setup>
import { computed } from 'vue'

const props = defineProps({
  fingerprint: {
    type: Object,
    required: true,
  },
})

defineEmits(['delete'])

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(props.fingerprint.createdAt))
})

const shortFingerprint = computed(() => {
  const { fingerprint } = props.fingerprint
  return `${fingerprint.slice(0, 16)}...${fingerprint.slice(-10)}`
})
</script>

<template>
  <article class="record-card">
    <div class="record-card__header">
      <div>
        <p class="eyebrow">{{ fingerprint.category }}</p>
        <h3>{{ fingerprint.title }}</h3>
      </div>
      <span class="pill">{{ fingerprint.algorithm }}</span>
    </div>

    <dl class="record-card__meta">
      <div>
        <dt>Responsable</dt>
        <dd>{{ fingerprint.ownerName }}</dd>
      </div>
      <div>
        <dt>Longueur</dt>
        <dd>{{ fingerprint.characterCount }} caractères</dd>
      </div>
      <div>
        <dt>Enregistré le</dt>
        <dd>{{ formattedDate }}</dd>
      </div>
    </dl>

    <p class="record-card__preview">{{ fingerprint.sourcePreview }}</p>

    <p class="hash-line">
      <span>Empreinte</span>
      <code>{{ shortFingerprint }}</code>
    </p>

    <div class="record-card__actions">
      <RouterLink :to="`/verify/${fingerprint._id}`" class="button button--primary">
        Verifier
      </RouterLink>
      <button class="button button--ghost" type="button" @click="$emit('delete', fingerprint)">
        Supprimer
      </button>
    </div>
  </article>
</template>
