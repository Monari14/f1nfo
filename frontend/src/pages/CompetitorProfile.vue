<template>
  <div class="container">
    <div v-if="loading" class="loading">Carregando...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="competitor" class="profile-card">
      <!-- Header com imagem do piloto e bandeira -->
      <div class="profile-header">
        <div class="pilot-photo-wrapper">
          <img
            v-if="competitor.image_url"
            :src="competitor.image_url"
            :alt="competitor.name"
            class="pilot-photo"
          />
        </div>
        <div class="pilot-name-flag">
          <h1>{{ competitor.name }}</h1>
          <img
            v-if="competitor.country_code && iso3to2[competitor.country_code]"
            :src="`https://flagcdn.com/w40/${iso3to2[competitor.country_code]}.png`"
            :alt="competitor.nationality"
            class="country-flag"
          />
        </div>
      </div>

      <!-- Info geral -->
      <div class="info-section general-info">
        <div class="info-item">
          <span>Abreviação:</span> {{ competitor.abbreviation }}
        </div>
        <div class="info-item">
          <span>País:</span> {{ competitor.nationality }}
        </div>
        <div class="info-item">
          <span>Gênero:</span> {{ competitor.gender }}
        </div>
        <div class="info-item">
          <span>Número do carro:</span> {{ info.car_number || '-' }}
        </div>
      </div>

      <!-- Equipes -->
      <div class="info-section">
        <h2>Equipe(s)</h2>
        <div v-if="teams.length" class="teams-list">
          <div v-for="team in teams" :key="team.id" class="team-card">
            <router-link :to="`/team/${team.id}`" class="team-link">
              {{ team.name }}
            </router-link>
            <small>{{ team.nationality }}</small>
          </div>
        </div>
        <p v-else class="no-teams">Nenhuma equipe cadastrada.</p>
      </div>

      <!-- Informações adicionais -->
      <div class="info-section">
        <h2>Informações</h2>
        <div class="grid-info">
          <div class="info-item"><span>Data de nascimento:</span> {{ formatDate(info.dateofbirth) }}</div>
          <div class="info-item"><span>Local de nascimento:</span> {{ info.placeofbirth || '-' }}</div>
          <div class="info-item"><span>Estreia na F1:</span> {{ formatDate(info.debut) }}</div>
          <div class="info-item"><span>Primeiros pontos:</span> {{ formatDate(info.first_points) }}</div>
          <div class="info-item"><span>Primeira pole:</span> {{ formatDate(info.first_pole) }}</div>
          <div class="info-item"><span>Primeira vitória:</span> {{ formatDate(info.first_victory) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { callAPI } from "../api";

const route = useRoute();
const competitor = ref(null);
const teams = ref([]);
const info = ref({});
const loading = ref(true);
const error = ref(null);

const iso3to2 = {
  AUS: "au", CHN: "cn", JPN: "jp", BHR: "bh", SAU: "sa",
  USA: "us", MEX: "mx", BRA: "br", SGP: "sg", ESP: "es",
  ITA: "it", MON: "mc", NLD: "nl", HUN: "hu", CAN: "ca",
  GBR: "gb", QAT: "qa", ARE: "ae", BEL: "be", AZE: "az",
  FRA: "fr", AUT: "at"
};

function saveCache(key, data, ttl = 60) {
  localStorage.setItem(key, JSON.stringify({ data, expires: Date.now() + ttl * 60 * 1000 }));
}
function getCache(key) {
  const c = localStorage.getItem(key);
  if (!c) return null;
  try {
    const p = JSON.parse(c);
    if (Date.now() < p.expires) return p.data;
    localStorage.removeItem(key);
  } catch {
    localStorage.removeItem(key);
  }
  return null;
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

async function loadCompetitor() {
  loading.value = true;
  error.value = null;
  const cacheKey = `competitor-${route.params.id}-profile`;
  const cached = getCache(cacheKey);
  if (cached) {
    competitor.value = cached.competitor;
    teams.value = cached.teams || [];
    info.value = cached.info || {};
    loading.value = false;
    return;
  }

  try {
    const data = await callAPI(`/competitors/${route.params.id}/profile.json`);
    competitor.value = data.competitor;
    teams.value = data.teams || [];
    info.value = data.info || {};
    saveCache(cacheKey, data, 30);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(loadCompetitor);
</script>

<style scoped>
/* === Container === */
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 16px;
  font-family: "Segoe UI", sans-serif;
  min-height: 100vh;
}

/* === Loading / Error === */
.loading {
  font-style: italic;
  color: #aaa;
  text-align: center;
  padding: 50px 0;
  font-size: 1.1rem;
}
.error {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid #ff6b6b;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
}

/* === Profile Card === */
.profile-card {
  border-radius: 15px;
  padding: 30px 22px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.profile-card:hover {
  transform: translateY(-3px);
}

/* === Header === */
.profile-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap; /* ✅ se adapta em telas menores */
  text-align: center;
}

.pilot-photo-wrapper {
  width: clamp(90px, 25vw, 130px);
  height: clamp(90px, 25vw, 130px);
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #ff3c3c;
  box-shadow: 0 4px 15px rgba(255,60,60,0.4);
  transition: transform 0.3s;
  flex-shrink: 0;
}
.pilot-photo-wrapper:hover {
  transform: scale(1.05);
}
.pilot-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pilot-name-flag {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.profile-header h1 {
  font-size: clamp(1.4rem, 4vw, 2.4rem); /* ✅ texto fluido */
  color: #ff3c3c;
  font-weight: 700;
}

.country-flag {
  width: 40px;
  height: auto;
  border-radius: 5px;
  border: 1px solid #333;
}

/* === Info Sections === */
.info-section {
  margin-bottom: 28px;
}

.info-section h2 {
  margin-bottom: 14px;
  color: #ff3c3c;
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  border-bottom: 2px solid #333;
  padding-bottom: 5px;
}

/* Info items */
.info-item {
  margin: 6px 0;
  font-size: 0.95rem;
  transition: transform 0.2s;
}
.info-item:hover {
  transform: translateX(3px);
}
.info-item span {
  font-weight: 600;
  color: #fff;
}

/* Teams */
.teams-list {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center; /* ✅ centraliza no mobile */
}
.team-card {
  background: #252525;
  padding: 12px 16px;
  border-radius: 10px;
  min-width: 130px;
  flex: 1 1 150px; /* ✅ flexível */
  text-align: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  transition: transform 0.3s, box-shadow 0.3s;
}
.team-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.6);
}
.team-card small {
  display: block;
  color: #aaa;
  font-size: 0.8rem;
}
.team-link {
  color: #ff3c3c;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}
.team-link:hover {
  color: #ff7878;
  text-decoration: underline;
}
.no-teams {
  color: #aaa;
  font-style: italic;
  text-align: center;
}

/* Grid info */
.grid-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

/* General info highlight */
.general-info {
  background: #1a1a1a;
  padding: 18px;
  border-radius: 10px;
  box-shadow: inset 0 0 15px rgba(255,60,60,0.1);
}

/* === Media Queries === */
@media (max-width: 768px) {
  .profile-card {
    padding: 24px 16px;
  }
  .teams-list {
    gap: 10px;
  }
}
@media (max-width: 480px) {
  .profile-header h1 {
    font-size: 1.2rem;
  }
  .country-flag {
    width: 30px;
  }
  .team-card {
    flex: 1 1 100%; /* ✅ ocupa linha inteira */
  }
}
</style>
