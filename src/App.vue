<script setup lang="ts">
import { RouterView } from 'vue-router';
import TheSidebar from './components/common/TheSidebar.vue';
import TheMenubar from './components/common/TheMenubar.vue';
</script>

<template>
  <TheMenubar />

  <main class="flex">
    <div class="w-52">
      <TheSidebar />
    </div>

    <RouterView />
  </main>
</template>

<style>
  main {
    min-height: calc(100vh - 80px);
  }
</style>