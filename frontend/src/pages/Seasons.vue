<template>
  <div class="container">
    <h1>Seasons</h1>
    
    <div v-if="loading" class="loading">Carregando...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="stages.length" class="stages-grid">
      <div 
        v-for="stage in stages" 
        :key="stage.id" 
        class="stage-card"
        @click="goToSeason(stage.id)"
      >
        <h2>{{ stage.description }}</h2>
        <p><strong>Ano:</strong> {{ stage.year }}</p>
        <p><strong>Início:</strong> {{ formatDate(stage.scheduled) }}</p>
        <p><strong>Fim:</strong> {{ formatDate(stage.scheduled_end) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { callAPI } from "../api";

const stages = ref([]);
const loading = ref(false);
const error = ref(null);
const router = useRouter();

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("pt-BR", { 
    weekday: "short", 
    day: "2-digit", 
    month: "short", 
    year: "numeric", 
    hour: "2-digit", 
    minute: "2-digit" 
  });
}

async function loadSeasons() {
  loading.value = true;
  error.value = null;
  try {
    const data = await callAPI("/seasons.json");
    if (data.stages) {
      stages.value = data.stages.map(stage => ({
        id: stage.id,
        description: stage.description,
        year: new Date(stage.scheduled).getFullYear(),
        scheduled: stage.scheduled,
        scheduled_end: stage.scheduled_end
      }));
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

function goToSeason(id) {
  router.push(`/season/${id}`);
}

loadSeasons();
</script>

<style scoped>
/* Container principal */
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Botões */
.btn {
  display: inline-block;
  padding: 12px 24px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #e10600, #ff3b3b);
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn:hover {
  background: linear-gradient(135deg, #b80400, #e60000);
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* Loading e erros */
.loading {
  font-style: italic;
  color: #555;
  margin-bottom: 10px;
}

.error {
  color: #d8000c;
  background-color: #ffd2d2;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: bold;
  margin-bottom: 10px;
  box-shadow: inset 0 0 5px rgba(216, 0, 12, 0.2);
}

/* Grid de estágios */
.stages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* Cards de estágios */
.stage-card {
  background: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-top: 4px solid #e10600;
}

.stage-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

/* Títulos e textos dos cards */
.stage-card h2 {
  margin: 0 0 12px 0;
  font-size: 1.25rem;
  color: #e10600;
  letter-spacing: 0.5px;
}

.stage-card p {
  margin: 4px 0;
  line-height: 1.5;
  color: #555;
  font-size: 0.95rem;
}

/* Responsividade */
@media (max-width: 600px) {
  .btn {
    width: 100%;
    text-align: center;
  }

  .stages-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>
