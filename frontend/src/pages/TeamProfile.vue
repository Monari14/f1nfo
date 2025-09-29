<template>
  <div class="container">
    <div v-if="loading" class="loading">Carregando...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="competitor" class="profile-card">
      <!-- Header do time -->
      <div class="profile-header">
        <img
          v-if="competitor.image_url"
          :src="competitor.image_url"
          :alt="competitor.name"
          class="team-photo"
        />
        <div class="team-name-country">
          <h1>{{ competitor.name }}</h1>
          <p class="abbreviation"><span>Abreviação:</span> {{ competitor.abbreviation }}</p>
          <p class="country"><span>País:</span> {{ competitor.nationality }}</p>
        </div>
      </div>

      <!-- Pilotos -->
      <div class="info-section">
        <h2>Pilotos</h2>
        <div v-if="competitors.length" class="pilots-list">
          <div v-for="c in competitors" :key="c.id" class="pilot-card">
            <img
              v-if="c.image_url"
              :src="c.image_url"
              :alt="c.name"
              class="pilot-photo"
            />
            <div class="pilot-info">
              <router-link :to="`/competitor/${c.id}`" class="pilot-name">{{ c.name }}</router-link>
              <span class="pilot-abbr">({{ c.abbreviation }})</span>
              <img
                v-if="c.country_code && iso3to2[c.country_code]"
                :src="`https://flagcdn.com/w20/${iso3to2[c.country_code]}.png`"
                class="pilot-flag"
                :alt="c.country_code"
              />
            </div>
          </div>
        </div>
        <p v-else>Nenhum piloto cadastrado.</p>
      </div>

      <!-- Informações do time -->
      <div class="info-section">
        <h2>Informações do Time</h2>
        <div class="info-grid">
          <div class="info-card"><span>Fundação:</span> {{ info.foundation_year }}</div>
          <div class="info-card"><span>Presidente:</span> {{ info.president }}</div>
          <div class="info-card"><span>Diretor Técnico:</span> {{ info.technical_director }}</div>
          <div class="info-card"><span>Diretor Esportivo:</span> {{ info.sports_director }}</div>
          <div class="info-card"><span>Localização:</span> {{ info.location }}</div>
          <div class="info-card"><span>Carro:</span> {{ info.car_name }} ({{ info.car_chassis }})</div>
          <div class="info-card"><span>Motor:</span> {{ info.car_engine_name }} - {{ info.car_engine_size }}cc</div>
          <div class="info-card"><span>Pneus:</span> {{ info.car_tyres }}</div>
          <div class="info-card"><span>Combustível:</span> {{ info.car_fuel_type }}</div>
          <div class="info-card"><span>Licença F1:</span> {{ info.f1_license }}</div>
          <div class="info-card"><span>Site Oficial:</span>
            <a :href="info.url_official" target="_blank">{{ info.url_official }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { callAPI } from "../api";

// ISO3 → ISO2 para bandeiras
const iso3to2 = {
  AUS: "au", CHN: "cn", JPN: "jp", BHR: "bh", SAU: "sa", 
  USA: "us", MEX: "mx", BRA: "br", SGP: "sg", ESP: "es", 
  ITA: "it", MON: "mc", NLD: "nl", HUN: "hu", CAN: "ca", 
  GBR: "gb", QAT: "qa", ARE: "ae", BEL: "be", AZE: "az", 
  FRA: "fr", MCO: "mc", AUT: "at"
};

const route = useRoute();
const competitor = ref(null);
const competitors = ref([]);
const info = ref({});
const loading = ref(true);
const error = ref(null);

// Cache localStorage
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

async function loadTeamProfile() {
  loading.value = true;
  error.value = null;

  const cacheKey = `team-${route.params.id}-profile`;
  const cached = getCache(cacheKey);
  if (cached) {
    competitor.value = cached.competitor;
    competitors.value = cached.competitors;
    info.value = cached.info;
    loading.value = false;
    return;
  }

  try {
    const data = await callAPI(`/teams/${route.params.id}/profile.json`);
    competitor.value = data.competitor;
    competitors.value = data.competitors || [];
    info.value = data.info || {};
    saveCache(cacheKey, { competitor: competitor.value, competitors: competitors.value, info: info.value }, 30);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(loadTeamProfile);
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: "Segoe UI", sans-serif;
  color: #e0e0e0;
}

.loading {
  font-style: italic;
  color: #aaa;
  text-align: center;
  padding: 50px 0;
}
.error {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid #ff6b6b;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 20px;
}

.profile-card {
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 30px 25px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.5);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  justify-content: center;
}

.team-photo {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #ff3c3c;
}

.team-name-country h1 {
  color: #ff3c3c;
  font-weight: 600;
  font-size: 2rem;
}

.abbreviation, .country {
  font-size: 0.95rem;
  color: #aaa;
}

.info-section h2 {
  margin-bottom: 15px;
  color: #ff3c3c;
  font-size: 1.4rem;
  border-bottom: 2px solid #333;
  padding-bottom: 5px;
}

.pilots-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.pilot-card {
  background: #252525;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.2s, background 0.2s;
}
.pilot-card:hover {
  background: #333;
  transform: translateY(-2px);
}

.pilot-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ff3c3c;
}

.pilot-info {
  display: flex;
  flex-direction: column;
}

.pilot-name {
  color: #ff3c3c;
  font-weight: 600;
  text-decoration: none;
}
.pilot-name:hover {
  color: #ff7878;
  text-decoration: underline;
}

.pilot-abbr {
  font-size: 0.85rem;
  color: #aaa;
}

.pilot-flag {
  width: 20px;
  height: 12px;
  object-fit: cover;
  margin-top: 3px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.info-card {
  background: #252525;
  padding: 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  line-height: 1.4;
}

.info-card span {
  font-weight: 600;
  color: #fff;
}

.info-card a {
  color: #3498db;
  text-decoration: none;
}
.info-card a:hover {
  text-decoration: underline;
}
</style>
