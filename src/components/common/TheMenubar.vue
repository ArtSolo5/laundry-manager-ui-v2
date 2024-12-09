<script setup lang="ts">
import Menubar from 'primevue/menubar';
import DarkLogo from '../icons/DarkLogo.vue';
</script>

<template>
  <header>
    <Menubar>
      <template #start>
        <DarkLogo />
    </template>
    </Menubar>
  </header>
</template>