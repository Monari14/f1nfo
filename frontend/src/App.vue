<script setup>
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <div>
    <Navbar />
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #111;
  color: #fff;
}
.container {
  padding: 20px;
}
</style>
