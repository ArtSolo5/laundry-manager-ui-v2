<script setup lang="ts">
import { TieredMenu } from 'primevue';
import type { MenuItem } from 'primevue/menuitem';
import { PrimeIcons } from '@primevue/core/api';

const items: MenuItem[] = [
  {
    label: 'Головна',
    icon: PrimeIcons.HOME,
    url: '/'
  },
  {
    label: 'Надходження',
    icon: PrimeIcons.PLUS_CIRCLE,
    url: '/arrivals'
  },
  {
    label: 'Прання',
    icon: PrimeIcons.PLAY,
    url: '/washes'
  },
  {
    label: 'Звіт',
    icon: PrimeIcons.FILE,
    url: '/report'
  },
  {
    label: 'Довідник',
    icon: PrimeIcons.QUESTION_CIRCLE,
    url: '/handbook'
  }
];
</script>

<template>
  <aside class="h-full">
    <TieredMenu :model="items" />
  </aside>
</template>

<style>
aside div {
 height: 100%;
}
</style>