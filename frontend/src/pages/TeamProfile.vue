<script setup>
import { ref } from "vue";
import { callAPI } from "../api";

const data = ref(null);
const loading = ref(false);
const error = ref(null);

// Exemplo de teamId (pegue um válido da API de schedule/seasons)
const teamId = "sr:competitor:3908";

async function loadTeamProfile() {
  loading.value = true;
  error.value = null;
  try {
    data.value = await callAPI(`/teams/${teamId}/profile.json`);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h2>Team Profile</h2>
    <button @click="loadTeamProfile">Carregar</button>
    <div v-if="loading">Carregando...</div>
    <div v-if="error" style="color:red">{{ error }}</div>
    <pre v-if="data">{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>
