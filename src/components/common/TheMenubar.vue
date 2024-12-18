<script setup lang="ts">
import { Menubar, Button } from 'primevue';
import LightLogo from '../icons/LightLogo.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <header>
    <Menubar class="border-b border-0 rounded-none">
      <template #start>
        <RouterLink to="/">
          <LightLogo class="w-14" />
        </RouterLink>
      </template>
      <template #end>
        <Button
          @click="authStore.logout"
          label="Вийти"
          type="button"
          id="logout-btn"
          variant="text"
          icon="pi pi-sign-out"
        />
      </template>
    </Menubar>
  </header>
</template>

<style>
.p-menubar {
  background-color: #27386b;
}
#logout-btn {
  color: white;
}
#logout-btn:hover {
  background-color: #27386b;
}
</style>
