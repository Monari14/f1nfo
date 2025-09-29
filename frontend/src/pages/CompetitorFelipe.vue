<template>
  <div class="container">
    <!-- Perfil do Competidor -->
    <div class="profile-card">
      <!-- Header -->
      <div class="profile-header">
        <div class="pilot-photo-wrapper">
          <img
            :src="'/profile.png'"
            alt="Felipe Eduardo Monari"
            class="pilot-photo"
          />
        </div>
        <div class="pilot-name-flag">
          <h1>Monari, Felipe</h1>
          <img
            :src="`https://flagcdn.com/w40/br.png`"
            alt="Bandeira"
            class="country-flag"
          />
        </div>
      </div>

      <!-- Info geral -->
      <div class="info-section general-info">
        <div class="info-item">
          <span>Abreviação:</span> MON
        </div>
        <div class="info-item">
          <span>País:</span> Brazil
        </div>
        <div class="info-item">
          <span>Gênero:</span> Male
        </div>
        <div class="info-item">
          <span>Número do carro:</span> 34
        </div>
      </div>

      <!-- Equipes -->
      <div class="info-section">
        <h2>Equipe(s)</h2>
        <div class="teams-list">
          <div class="team-card">
            <a href="/#/team/sr:competitor:4511" class="team-link">
              Williams
            </a>
            <small>Great Britain</small>
          </div>
          <div class="team-card">
            <a href="/#/team/sr:competitor:41127" class="team-link">
              Mercedes AMG Motorsport
            </a>
            <small>Germany</small>
          </div>
        </div>
      </div>

      <!-- Informações adicionais -->
      <div class="info-section">
        <h2>Informações</h2>
        <div class="grid-info">
          <div class="info-item"><span>Data de nascimento:</span> 12/12/2007</div>
          <div class="info-item"><span>Local de nascimento:</span> Erechim - RS</div>
          <div class="info-item"><span>Estreia na F1:</span> -</div>
          <div class="info-item"><span>Primeiros pontos:</span> -</div>
          <div class="info-item"><span>Primeira pole:</span> -</div>
          <div class="info-item"><span>Primeira vitória:</span> -</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* === Container === */
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 16px;
  font-family: "Segoe UI", sans-serif;
  color: #eaeaea;
  min-height: 100vh;
}

/* === Profile Card === */
.profile-card {
  border-radius: 18px;
  padding: 32px 24px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.profile-card:hover {
  transform: translateY(-4px);
}

/* === Header === */
.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap; /* ✅ melhora no mobile */
  text-align: center;
  justify-content: center;
}

.pilot-photo-wrapper {
  width: clamp(90px, 25vw, 140px);
  height: clamp(90px, 25vw, 140px);
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #ff2e2e;
  box-shadow: 0 6px 20px rgba(255,46,46,0.5);
  transition: transform 0.3s;
  flex-shrink: 0;
}
.pilot-photo-wrapper:hover {
  transform: scale(1.07);
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
  flex-wrap: wrap; /* ✅ nome + bandeira não quebra feio */
  justify-content: center;
}

.profile-header h1 {
  font-size: clamp(1.6rem, 4vw, 2.6rem); /* ✅ tipografia fluida */
  color: #ff2e2e;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0 0 12px rgba(255,46,46,0.5);
}

.country-flag {
  width: 40px;
  height: auto;
  border-radius: 6px;
  border: 1px solid #444;
}

/* === Info Sections === */
.info-section {
  margin-bottom: 32px;
}

.info-section h2 {
  margin-bottom: 16px;
  color: #ff2e2e;
  font-size: clamp(1.2rem, 3vw, 1.6rem);
  font-weight: 700;
  border-left: 4px solid #ff2e2e;
  padding-left: 10px;
}

/* Info items */
.info-item {
  margin: 6px 0;
  font-size: 0.95rem;
  transition: transform 0.2s;
}
.info-item:hover {
  transform: translateX(4px);
}
.info-item span {
  font-weight: 600;
  color: #fff;
}

/* Teams */
.teams-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center; /* ✅ centraliza no mobile */
}
.team-card {
  background: #1b1b1b;
  padding: 14px 16px;
  border-radius: 12px;
  min-width: 130px;
  text-align: center;
  box-shadow: 0 6px 14px rgba(0,0,0,0.6);
  transition: transform 0.3s, box-shadow 0.3s;
  flex: 1 1 150px; /* ✅ cards flexíveis */
}
.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 26px rgba(0,0,0,0.7);
}
.team-card small {
  display: block;
  color: #aaa;
  font-size: 0.8rem;
}
.team-link {
  color: #ff2e2e;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}
.team-link:hover {
  color: #ff6666;
  text-decoration: underline;
}
.no-teams {
  color: #aaa;
  font-style: italic;
}

/* Grid info */
.grid-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
}

/* General info highlight */
.general-info {
  background: #151515;
  padding: 18px;
  border-radius: 12px;
  box-shadow: inset 0 0 20px rgba(255,46,46,0.15);
}

/* === Media Queries === */
@media (max-width: 768px) {
  .profile-card {
    padding: 24px 16px;
  }
  .profile-header {
    margin-bottom: 24px;
  }
  .teams-list {
    gap: 12px;
  }
}
@media (max-width: 480px) {
  .profile-header h1 {
    font-size: 1.4rem;
  }
  .country-flag {
    width: 32px;
  }
  .team-card {
    min-width: 100%;
  }
}
</style>
