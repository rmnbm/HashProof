<script setup>
const navigationItems = [
  { label: 'Vue d’ensemble', to: '/' },
  { label: 'Nouvelle empreinte', to: '/create' },
  { label: 'Archive', to: '/archive' },
]
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="container topbar__inner">
        <RouterLink to="/" class="brand">
          <span class="brand__eyebrow">Mini-projet ESILV 2026</span>
          <span class="brand__title">HashProof</span>
        </RouterLink>

        <nav class="nav">
          <RouterLink
            v-for="item in navigationItems"
            :key="item.to"
            :to="item.to"
            class="nav__link"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="container main-content">
      <RouterView />
    </main>
  </div>
</template>
