<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import TheSidebar from './components/common/TheSidebar.vue';
import TheMenubar from './components/common/TheMenubar.vue';
import { computed, onMounted } from 'vue';
import { useAuthStore } from './stores/auth';

const auth = useAuthStore();
const route = useRoute();

const isOnLogin = computed(() => route.path === '/login');

onMounted(() => {
  auth.loadUserFromToken();
});
</script>

<template>
  <TheMenubar v-if="!isOnLogin" />

  <main class="flex">
    <div v-if="!isOnLogin" class="w-52">
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
