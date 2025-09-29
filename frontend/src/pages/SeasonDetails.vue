<template>
  <div class="container">
    <h1>Calendário de GPs 2025</h1>

    <div v-if="loading" class="loading">Carregando...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="stages.length" class="stages-grid">
      <div 
        v-for="gp in stages" 
        :key="gp.id" 
        class="stage-card"
        @click="goToDetails(gp.id)"
      >
        <h2>{{ gp.description }}</h2>
        <p><strong>Início:</strong> {{ formatDate(gp.scheduled) }}</p>
        <p><strong>Fim:</strong> {{ formatDate(gp.scheduled_end) }}</p>
        <p><strong>Status:</strong> {{ gp.status }}</p>
        <p v-if="gp.venue"><strong>Pista:</strong> {{ gp.venue.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { callAPI } from '../api';

const stages = ref([]);
const loading = ref(true);
const error = ref(null);

const router = useRouter();

// Formatação de datas
function formatDate(isoString) {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Cache simples
function saveCache(key, data, ttlMinutes = 60) {
  const expires = new Date().getTime() + ttlMinutes * 60 * 1000;
  localStorage.setItem(key, JSON.stringify({ data, expires }));
}

function getCache(key) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  try {
    const parsed = JSON.parse(cached);
    if (new Date().getTime() < parsed.expires) return parsed.data;
    else localStorage.removeItem(key);
  } catch {
    localStorage.removeItem(key);
  }
  return null;
}

// Navegar para detalhes
function goToDetails(stageId) {
  router.push({ name: 'SeasonDetails', params: { id: stageId } });
}

// Carregar todos os GPs
async function loadSeasons() {
  loading.value = true;
  error.value = null;

  const cacheKey = 'seasons-2025';
  const cachedData = getCache(cacheKey);

  if (cachedData) {
    console.log('Carregando do cache:', cachedData);
    stages.value = cachedData;
    loading.value = false;
    return;
  }

  try {
    // CORREÇÃO: endpoint correto para todos os GPs da temporada
    const data = await callAPI('/seasons/2025/sport_events.json');
    console.log('Resposta completa da API:', data);

    if (data.stages && data.stages.length > 0) {
      stages.value = data.stages;
      saveCache(cacheKey, data.stages, 60);
    } else {
      error.value = 'Nenhum GP encontrado.';
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(loadSeasons);
</script>

<style scoped>
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.loading {
  font-style: italic;
  color: #555;
}

.error {
  color: #d8000c;
  background-color: #ffd2d2;
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: bold;
  margin-bottom: 20px;
}

.stages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.stage-card {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.stage-card:hover {
  transform: translateY(-5px) scale(1.01);
  box-shadow: 0 15px 30px rgba(0,0,0,0.12);
}

.stage-card h2 {
  color: #e10600;
  margin-bottom: 12px;
}

.stage-card p {
  margin: 6px 0;
}
</style>
