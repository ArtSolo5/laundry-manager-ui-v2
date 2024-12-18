<script setup lang="ts">
import { computed } from 'vue';
import { Tabs, TabList, Tab, TabPanel, TabPanels } from 'primevue';
import TheDepartments from '@/components/handbook/TheDepartments.vue';
import TheUniforms from '@/components/handbook/TheUniforms.vue';
import TheAbstergents from '@/components/handbook/TheAbstergents.vue';
import ThePrograms from '@/components/handbook/ThePrograms.vue';
import permissions from '@/permissions/handbook';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const tabs = [
  {
    title: 'Програми',
    value: 'programsTab',
    permissions: permissions.programs,
  },
  {
    title: 'Відділи',
    value: 'departmentsTab',
    permissions: permissions.departments,
  },
  {
    title: 'Засоби',
    value: 'abstergentsTab',
    permissions: permissions.abstergents,
  },
  {
    title: 'Одяг',
    value: 'uniformsTab',
    permissions: permissions.uniforms,
  },
];

const allowedTabs = computed(() => tabs.filter((t) => authStore.isAllowed(t.permissions)));
</script>

<template>
  <section class="p-5">
    <h1 class="font-bold text-lg">Довідник</h1>

    <Tabs :value="allowedTabs[0].value">
      <TabList>
        <Tab v-for="(tab, index) in allowedTabs" :key="index" :value="tab.value">{{
          tab.title
        }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-if="authStore.isAllowed(permissions.programs)" value="programsTab">
          <ThePrograms />
        </TabPanel>
        <TabPanel v-if="authStore.isAllowed(permissions.departments)" value="departmentsTab">
          <TheDepartments />
        </TabPanel>
        <TabPanel v-if="authStore.isAllowed(permissions.abstergents)" value="abstergentsTab">
          <TheAbstergents />
        </TabPanel>
        <TabPanel v-if="authStore.isAllowed(permissions.uniforms)" value="uniformsTab">
          <TheUniforms />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </section>
</template>
