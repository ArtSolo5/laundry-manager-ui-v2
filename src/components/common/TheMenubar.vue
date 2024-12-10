<script setup lang="ts">
import Menubar from 'primevue/menubar';
import DarkLogo from '../icons/DarkLogo.vue';
</script>

<template>
  <header>
    <Menubar class="border-b border-0 rounded-none">
      <template #start>
        <DarkLogo class="w-14" />
      </template>
    </Menubar>
  </header>
</template>
