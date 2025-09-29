<template>
  <nav class="navbar">
    <RouterLink :to="{ name: 'Seasons' }" class="logo">
      <img src="/logo.png" alt="Logo" />
      <span>f1nfo</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  background: #121212;
  padding: 14px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.logo img {
  width: 36px;
  height: 36px;
  border-radius: 6px;
}

.logo span {
  color: #e0e0e0;
  letter-spacing: 0.5px;
}

.logo:hover {
  opacity: 0.8;
}
</style>
