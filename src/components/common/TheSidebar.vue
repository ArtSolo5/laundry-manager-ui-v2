<script setup lang="ts">
import { TieredMenu } from 'primevue';
import type { MenuItem } from 'primevue/menuitem';
import { PrimeIcons } from '@primevue/core/api';
import permissions from '@/permissions/sidebar';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const items: MenuItem[] = [
  {
    label: 'Головна',
    icon: PrimeIcons.HOME,
    route: '/',
    permissions: [],
  },
  {
    label: 'Надходження',
    icon: PrimeIcons.PLUS_CIRCLE,
    route: '/arrivals',
    permissions: permissions.arrivals,
  },
  {
    label: 'Прання',
    icon: PrimeIcons.PLAY,
    route: '/washes',
    permissions: permissions.washes,
  },
  {
    label: 'Звіт',
    icon: PrimeIcons.FILE,
    route: '/report',
    permissions: permissions.reports,
  },
  {
    label: 'Довідник',
    icon: PrimeIcons.QUESTION_CIRCLE,
    route: '/handbook',
    permissions: permissions.handbook,
  },
];

const allowedMunuItems = computed(() => {
  return items.filter((i) => authStore.isAllowed(i.permissions));
});
</script>

<template>
  <aside class="h-full">
    <TieredMenu class="border-r border-0 rounded-none" :model="allowedMunuItems">
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
