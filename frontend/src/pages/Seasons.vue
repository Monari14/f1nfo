<template>
  <div class="container">
    <h1>Temporadas de F1</h1>

    <div v-if="loading" class="loading">Carregando...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="seasons.length" class="stages-grid">
      <div 
        v-for="season in seasons" 
        :key="season.id" 
        class="stage-card"
        @click="goToSchedule(season.id)"
      >
        <h2>{{ season.description }}</h2>
        <p><strong>Ano:</strong> {{ season.year }}</p>
        <p><strong>Início:</strong> {{ formatDate(season.scheduled) }}</p>
        <p><strong>Fim:</strong> {{ formatDate(season.scheduled_end) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { callAPI } from "../api";

const seasons = ref([]);
const loading = ref(false);
const error = ref(null);
const router = useRouter();

function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function saveCache(key, data, ttlMinutes = 60) {
  localStorage.setItem(key, JSON.stringify({ data, expires: Date.now() + ttlMinutes*60*1000 }));
}
function getCache(key) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  try {
    const parsed = JSON.parse(cached);
    if (Date.now() < parsed.expires) return parsed.data;
    localStorage.removeItem(key);
  } catch { localStorage.removeItem(key); }
  return null;
}

function goToSchedule(id) {
  router.push(`/schedule/${id}`);
}

async function loadSeasons() {
  loading.value = true;
  error.value = null;
  const cacheKey = "seasons";
  const cached = getCache(cacheKey);
  if (cached) {
    seasons.value = cached;
    loading.value = false;
    return;
  }

  try {
    const data = await callAPI("/seasons.json");
    if (data.stages?.length) {
      const mapped = data.stages.map(s => ({
        id: s.id,
        description: s.description,
        year: new Date(s.scheduled).getFullYear(),
        scheduled: s.scheduled,
        scheduled_end: s.scheduled_end || s.scheduled
      }));
      seasons.value = mapped;
      saveCache(cacheKey, mapped, 60);
    } else error.value = "Nenhuma temporada encontrada.";
  } catch (err) { error.value = err.message; }
  finally { loading.value = false; }
}

onMounted(loadSeasons);
</script>

<style scoped>
/* Container centralizado */
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: "Segoe UI", sans-serif;
  color: #e0e0e0;
}

/* Título */
h1 {
  font-weight: 400;
  text-align: center;
  margin-bottom: 40px;
  color: #fff;
}

/* Loading e erro */
.loading {
  font-style: italic;
  color: #aaa;
  text-align: center;
}

.error {
  color: #ff6b6b;
  background: #330000;
  padding: 12px;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 20px;
}

/* Grid minimalista */
.stages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

/* Card dark minimal */
.stage-card {
  background: #1e1e1e;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

.stage-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.7);
}

/* Título do card */
.stage-card h2 {
  margin-bottom: 12px;
  font-size: 1.2rem;
  color: #ff3c3c;
}

/* Detalhes do GP */
.stage-card p {
  margin: 4px 0;
  font-size: 0.9rem;
  color: #ccc;
}

.stage-card p span {
  font-weight: 500;
  color: #fff;
}
</style>