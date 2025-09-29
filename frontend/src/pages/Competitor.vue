<script setup>
import { ref } from "vue";
import { callAPI } from "../api";

const data = ref(null);
const loading = ref(false);
const error = ref(null);

// Exemplo de competitorId (pegue um válido da API de schedule/summary)
const competitorId = "sr:competitor:3908";

async function loadCompetitor() {
  loading.value = true;
  error.value = null;
  try {
    data.value = await callAPI(`/competitors/${competitorId}/profile.json`);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h2>Competitor Profile</h2>
    <button @click="loadCompetitor">Carregar</button>
    <div v-if="loading">Carregando...</div>
    <div v-if="error" style="color:red">{{ error }}</div>
    <pre v-if="data">{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>
