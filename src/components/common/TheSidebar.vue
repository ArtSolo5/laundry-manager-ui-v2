<script setup lang="ts">
import { TieredMenu } from 'primevue';
import type { MenuItem } from 'primevue/menuitem';
import { PrimeIcons } from '@primevue/core/api';

const items: MenuItem[] = [
  {
    label: 'Головна',
    icon: PrimeIcons.HOME,
    route: '/',
  },
  {
    label: 'Надходження',
    icon: PrimeIcons.PLUS_CIRCLE,
    route: '/arrivals',
  },
  {
    label: 'Прання',
    icon: PrimeIcons.PLAY,
    route: '/washes',
  },
  {
    label: 'Звіт',
    icon: PrimeIcons.FILE,
    route: '/report',
  },
  {
    label: 'Довідник',
    icon: PrimeIcons.QUESTION_CIRCLE,
    route: '/handbook',
  },
];
</script>

<template>
  <aside class="h-full">
    <TieredMenu class="border-r border-0 rounded-none" :model="items">
      <template #item="{ item, props }">
        <router-link v-slot="{ href, navigate }" :to="item.route" custom>
            <a :href="href" v-bind="props.action" @click="navigate">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
            </a>
        </router-link>
      </template>
    </TieredMenu>
  </aside>
</template>

<style>
aside div {
  height: 100%;
}
</style>
