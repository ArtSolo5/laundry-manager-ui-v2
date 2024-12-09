<script setup lang="ts">
import { RouterView } from 'vue-router';
import TheSidebar from './components/common/TheSidebar.vue';
import TheMenubar from './components/common/TheMenubar.vue';
</script>

<template>
  <TheMenubar />

  <div class="flex">
    <div class="w-52 h-screen">
      <TheSidebar />
    </div>

    <RouterView />
  </div>
</template>
