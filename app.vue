<template>
  <div class="container">
    <NuxtPage />
  </div>
</template>

<script setup>
import "@picocss/pico";
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
