<template>
  <nav class="navbar">
    <div class="logo">
      <img src="/logo.png" alt="Logo" />
      <span>f1nfo</span>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #372e50ff;
  padding: 10px 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem;
  font-weight: bold;
  color: #fff;
}

.logo img {
  width: 40px;
  height: 40px;
}
</style>
