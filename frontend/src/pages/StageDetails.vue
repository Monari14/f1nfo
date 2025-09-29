<template>
  <div class="container">
    <div v-if="loading" class="loading">Carregando...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="stage">
      <!-- Título e bandeira do país -->
      <h1>
        <img
          v-if="stage.venue?.country_code"
          :src="getFlagUrl(stage.venue.country_code)"
          :alt="stage.venue.country"
          class="country-flag"
        />
        {{ stage.description || "Stage sem descrição" }}
      </h1>

      <div class="race-summary">
        <p>
          <strong>Status:</strong> {{ stage.status || '-' }}
          {{ stage.substatus ? `- ${stage.substatus}` : '' }}
        </p>
        <p v-if="stage.venue">
          <strong>Pista: </strong>
          <a :href="stage.venue.url_official" target="_blank">{{ stage.venue.name }}</a>
        </p>
        <p v-if="stage.venue"><strong>Local:</strong> {{ stage.venue.city }}, {{ stage.venue.country }}</p>
        <p v-if="stage.weather">
          <strong>Clima:</strong> {{ stage.weather }} |
          Ar: {{ stage.air_temperature ?? '-' }}°C |
          Pista: {{ stage.track_temperature ?? '-' }}°C
        </p>
        <p v-if="stage.laps"><strong>Voltas:</strong> {{ stage.laps_completed }} / {{ stage.laps }}</p>
      </div>

      <!-- Sessões de eventos -->
      <div v-if="stage.type === 'event'">
        <h2>Sessões do Evento</h2>
        <div v-if="Array.isArray(stage.stages) && stage.stages.length" class="sessions-list">
          <router-link
            v-for="s in stage.stages"
            :key="s.id"
            :to="`/gp/${s.id}`"
            class="session-link"
          >
            <div class="session-info">
              <strong>{{ s.description || '-' }}</strong>
              <span>{{ formatDate(s.scheduled) }}</span>
            </div>
            <span class="arrow">&rarr;</span>
          </router-link>
        </div>
        <p v-else class="no-data">Nenhuma sessão disponível para este evento.</p>
      </div>

      <!-- Resultados de corrida ou qualificação -->
      <div v-if="stage.type === 'race' || stage.type === 'qualifying'">
        <h2 v-if="stage.type === 'race'">Resultado da Corrida</h2>
        <h2 v-else-if="stage.type === 'qualifying'">Resultado da Qualificação</h2>
        
        <!-- Pódio -->
        <div v-if="stage.type === 'race' && top3.length > 0" class="podium">
          <div
            v-for="(competitor, index) in top3"
            :key="competitor.id"
            :class="['podium-card', podiumColor(index)]"
          >
            <div class="podium-pos">{{ index + 1 }}º</div>
            <div class="podium-name">
              <!-- Bandeira do país do competidor -->
              <img
                v-if="competitor.country_code && iso3to2[competitor.country_code]"
                :src="`https://flagcdn.com/w40/${iso3to2[competitor.country_code]}.png`"
                :alt="competitor.country_code"
                class="country-flag"
              />
              {{ competitor.name || '-' }}
            </div>
            <div class="podium-team">{{ competitor.team?.name || '-' }}</div>
          </div>
        </div>

        <!-- Tabela de competidores compacta -->
        <div class="table-wrapper" v-if="stage.competitors?.length">
          <table>
            <thead>
              <tr>
                <th>Pos</th>
                <th>Piloto</th>
                <th>Melhor Volta</th>
                <th>Intervalo</th>
                <th>Gap</th>
                <th>Grid</th>
                <th>Status</th>
                <th>Pontos</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in sortedCompetitors" :key="c.id">
                <td>{{ c.result?.position ?? '-' }}</td>
                <td>
                  <div class="competitor-name">
                    <img
                      v-if="c.country_code"
                      :src="getFlagUrl(c.country_code)"
                      :alt="c.country_code"
                      class="competitor-flag"
                    />
                    <router-link :to="`/competitor/${c.id}`" target="_blank">{{ c.name || '-' }}</router-link>
                  </div>
                  <div class="team-name">
                    <router-link :to="`/team/${c.team?.id || '-'}`" target="_blank">{{ c.team?.name || '-' }}</router-link>
                    <br>{{ c.result?.car_number ?? '-' }}
                  </div>
                </td>
                <td>{{ c.result?.fastest_lap_time ?? '-' }}</td>
                <td>{{ c.result?.interval_to_position_ahead ?? '-' }}</td>
                <td>{{ c.result?.gap_to_leader ?? '-' }}</td>
                <td>{{ c.result?.grid ?? '-' }}</td>
                <td>{{ c.result?.status ?? '-' }}</td>
                <td>{{ c.result?.points ?? '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="no-data">Dados de classificação não disponíveis.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { callAPI } from "../api";

const route = useRoute();
const stage = ref(null);
const loading = ref(true);
const error = ref(null);

const iso3to2 = {
  // Países dos GPs
  AUS: "au",
  CHN: "cn",
  JPN: "jp",
  BHR: "bh",
  SAU: "sa",
  USA: "us",
  MEX: "mx",
  BRA: "br",
  SGP: "sg",
  ESP: "es",
  ITA: "it",
  MON: "mc",
  NLD: "nl",
  HUN: "hu",
  CAN: "ca",
  GBR: "gb",
  QAT: "qa",
  ARE: "ae",
  BEL: "be",
  AZE: "az",
  FRA: "fr",
  AUT: "at",

  // Nacionalidades comuns de pilotos
  GER: "de",
  RUS: "ru",
  FIN: "fi",
  SWE: "se",
  NOR: "no",
  DEN: "dk",
  POR: "pt",
  THA: "th",
  ARG: "ar",
  NZL: "nz",
  DEU: "de",
  ENG: "gb-eng",
  MCO: "mc",
  DNK: "dk"
};

const getFlagUrl = (iso3) => {
  const code2 = iso3to2[iso3];
  return code2 ? `https://flagcdn.com/w2560/${code2}.png` : null;
};

function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Cache
function saveCache(key, data, ttlMinutes = 30) {
  localStorage.setItem(key, JSON.stringify({ data, expires: Date.now() + ttlMinutes * 60 * 1000 }));
}
function getCache(key) {
  const c = localStorage.getItem(key);
  if (!c) return null;
  try {
    const p = JSON.parse(c);
    if (Date.now() < p.expires) return p.data;
    localStorage.removeItem(key);
  } catch { localStorage.removeItem(key); }
  return null;
}

async function loadStage(stageId) {
  loading.value = true;
  error.value = null;
  stage.value = null;

  const cacheKey = `stage-${stageId}-summary`;
  const cached = getCache(cacheKey);
  if (cached) {
    stage.value = cached;
    loading.value = false;
    return;
  }

  try {
    const data = await callAPI(`/sport_events/${stageId}/summary.json`);
    const stageData = data.stage || data.sport_event || data.event;
    if (!stageData) throw new Error("Formato inesperado da API.");
    stage.value = stageData;
    saveCache(cacheKey, stageData);
  } catch (err) {
    console.error(err);
    error.value = "Não foi possível carregar os dados.";
  } finally {
    loading.value = false;
  }
}

// Competidores ordenados
const sortedCompetitors = computed(() => {
  if (!stage.value?.competitors) return [];
  return [...stage.value.competitors].sort(
    (a, b) => (a.result?.position ?? 999) - (b.result?.position ?? 999)
  );
});

// Top 3 pódio
const top3 = computed(() => sortedCompetitors.value.slice(0, 3));
function podiumColor(index) {
  if (index === 0) return "gold";
  if (index === 1) return "silver";
  if (index === 2) return "bronze";
  return "";
}

// Montagem e watch
onMounted(() => loadStage(route.params.id));
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) loadStage(newId);
});
</script>

<style scoped>
/* --- Bandeiras --- */
.country-flag { width: 25px; height: 17px; margin-right: 8px; vertical-align: middle; border: 1px solid #333; border-radius: 2px; }
.competitor-flag { width: 20px; height: 14px; margin-right: 6px; vertical-align: middle; border: 1px solid #333; border-radius: 2px; }
.competitor-name { display: flex; align-items: center; }

/* --- restante do estilo igual ao seu código anterior --- */
.container { max-width: 1200px; margin: 0 auto; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #e0e0e0; }
h1 { text-align: center; color: #fff; margin-bottom: 20px; font-weight: 600; font-size: 2.2rem; }
h2 { margin-top: 40px; margin-bottom: 15px; color: #e84118; border-bottom: 2px solid #333; padding-bottom: 8px; font-weight: 500; font-size: 1.5rem; }
.loading { text-align: center; font-size: 1.2rem; padding: 40px; color: #aaa; }
.error { color: #ff6b6b; background-color: rgba(255, 107, 107, 0.1); border: 1px solid #ff6b6b; padding: 15px; border-radius: 8px; text-align: center; }
.race-summary { background-color: #1e1e1e; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
.race-summary p { margin: 8px 0; line-height: 1.6; font-size: 1rem; }
.race-summary a { color: #3498db; text-decoration: none; font-weight: 500; }
.race-summary a:hover { text-decoration: underline; }
.sessions-list { display: flex; flex-direction: column; gap: 10px; }
.session-link { display: flex; justify-content: space-between; align-items: center; background: #252525; padding: 15px 20px; border-radius: 8px; text-decoration: none; color: #e0e0e0; transition: background-color 0.2s ease, transform 0.2s ease; }
.session-link:hover { background-color: #333; transform: translateY(-2px); }
.session-info { display: flex; flex-direction: column; }
.session-info strong { font-size: 1.1rem; margin-bottom: 4px; }
.session-info span { font-size: 0.9rem; color: #aaa; }
.arrow { font-size: 1.5rem; color: #e84118; }
.podium { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 25px 0 40px; text-align: center; }
.podium-card { padding: 20px; border-radius: 12px; color: #111; font-weight: 600; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); }
.podium-pos { font-size: 2rem; font-weight: 700; }
.podium-name { font-size: 1.2rem; margin: 8px 0; }
.podium-team { font-size: 0.9rem; opacity: 0.8; }
.podium-card.gold { background: linear-gradient(145deg, #FFDF00, #F0C300); }
.podium-card.silver { background: linear-gradient(145deg, #e0e0e0, #b0b0b0); }
.podium-card.bronze { background: linear-gradient(145deg, #CD7F32, #B8732E); }
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; margin-top: 20px; }
th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #333; }
th { background-color: #1e1e1e; color: #e84118; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
tbody tr { background-color: #252525; transition: background-color 0.2s; }
tbody tr:hover { background-color: #333; }
td a { color: #3498db; text-decoration: none; font-weight: 500; }
td a:hover { text-decoration: underline; }
.team-name { font-size: 0.8rem; color: #aaa; margin-top: 2px; }
.compact-info div { font-size: 0.85rem; line-height: 1.3; }
.no-data { font-style: italic; color: #888; margin-top: 20px; text-align: center; background-color: #252525; padding: 20px; border-radius: 8px; }
</style>
