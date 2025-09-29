<script setup>
import { ref } from "vue";
import { callAPI } from "../api";

const data = ref(null);
const loading = ref(false);
const error = ref(null);

// Exemplo de stageId (mesmo usado no Schedule)
const stageId = "sr:stage:937579";

async function loadStageSummary() {
  loading.value = true;
  error.value = null;
  try {
    data.value = await callAPI(`/sport_events/${stageId}/summary.json`);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h2>Stage Summary</h2>
    <button @click="loadStageSummary">Carregar</button>
    <div v-if="loading">Carregando...</div>
    <div v-if="error" style="color:red">{{ error }}</div>
    <pre v-if="data">{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>
