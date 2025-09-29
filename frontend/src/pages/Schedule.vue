<template>
  <div class="container">
    <h1>Calendário</h1>

    <div v-if="loading" class="loading">Carregando...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="gps.length" class="stages-grid">
      <div v-for="gp in gps" :key="gp.id" class="stage-card" @click="goToGP(gp.id)">
        <div class="header">
          <img :src="getFlag(gp.venue?.country_code || '-')" :alt="gp.venue?.country || '-'" class="flag" />
          <h2>{{ gp.description }}</h2>
        </div>
        <p><span>País:</span> {{ gp.venue?.country || '-'}}</p>
        <p><span>Cidade:</span> {{ gp.venue?.city || '-'}}</p>
        <p><span>Início:</span> {{ formatDate(gp.scheduled) }}</p>
        <p><span>Fim:</span> {{ formatDate(gp.scheduled_end) }}</p>
        <p><span>Status:</span> {{ gp.status || "-" }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { callAPI } from "../api";

const gps = ref([]);
const loading = ref(true);
const error = ref(null);
const route = useRoute();
const router = useRouter();
const seasonId = route.params.id;

function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString('pt-BR', { 
    weekday:'short', day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' 
  });
}

function saveCache(key, data, ttl=60){
  localStorage.setItem(key, JSON.stringify({data,expires:Date.now()+ttl*60*1000}));
}

function getCache(key){
  const c=localStorage.getItem(key);
  if(!c) return null;
  try{
    const p=JSON.parse(c);
    if(Date.now()<p.expires) return p.data;
    localStorage.removeItem(key);
  }catch{ localStorage.removeItem(key);}
  return null;
}

function goToGP(gpId){
  router.push(`/gp/${gpId}`);
}

// Função para gerar URL da bandeira
function getFlag(code) {
  const iso3to2 = {
    AUS: "au", CHN: "cn", JPN: "jp", BHR: "bh", SAU: "sa", 
    USA: "us", MEX: "mx", BRA: "br", SGP: "sg", ESP: "es", 
    ITA: "it", MON: "mc", NLD: "nl", HUN: "hu", CAN: "ca", 
    GBR: "gb", QAT: "qa", ARE: "ae", BEL: "be", AZE: "az", 
    FRA: "fr", MCO: "mc", AUT: "at", MYS: "my", TUR: "tu",
    FRE: "fr", BRI: "gb-eng", POL: "pl"
  };
  const code2 = iso3to2[code.toUpperCase()] || code.toLowerCase();
  return `https://flagcdn.com/w80/${code2}.png`;
}

async function loadGPs(){
  loading.value = true;
  error.value = null;
  const cacheKey = `season-${seasonId}-gps`;
  const cached = getCache(cacheKey);
  if(cached){ gps.value = cached; loading.value=false; return; }

  try {
    const data = await callAPI(`/sport_events/${seasonId}/schedule.json`);
    const events = data.stages || data.sport_events || [];
    if(events.length>0){
      gps.value = events;
      saveCache(cacheKey, events, 60);
    } else error.value="Nenhum GP encontrado.";
  } catch(err){ error.value=err.message; }
  finally{ loading.value=false; }
}

onMounted(loadGPs);
</script>

<style scoped>
.container { 
  max-width: 1000px; margin: 0 auto; padding: 40px 20px; font-family: "Segoe UI", sans-serif; color: #e0e0e0; 
}
h1 { font-weight: 400; text-align: center; margin-bottom: 40px; color: #fff; }
.loading { font-style: italic; color: #aaa; text-align: center; }
.error { color: #ff6b6b; background: #330000; padding: 12px; border-radius: 8px; font-weight: 500; text-align: center; margin-bottom: 20px; }

.stages-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
  gap: 20px; 
}

.stage-card { 
  background: #1e1e1e; 
  border-radius: 16px; 
  padding: 20px; 
  cursor: pointer; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.5); 
  transition: transform 0.2s, box-shadow 0.2s; 
}
.stage-card:hover { 
  transform: translateY(-5px); 
  box-shadow: 0 10px 25px rgba(0,0,0,0.7); 
}

.stage-card .header { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  margin-bottom: 10px; 
}
.stage-card .header h2 { 
  margin: 0; 
  font-size: 1.2rem; 
  color: #ff3c3c; 
}
.stage-card .flag { 
  width: 32px; 
  height: 24px; 
  object-fit: cover; 
  border-radius: 3px; 
  border: 1px solid #555; 
}

.stage-card p { 
  margin: 3px 0; 
  font-size: 0.9rem; 
  color: #ccc; 
}
.stage-card p span { 
  font-weight: 500; 
  color: #fff; 
}
</style>
