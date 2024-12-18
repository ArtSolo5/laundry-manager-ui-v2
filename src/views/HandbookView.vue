<script setup lang="ts">
import { useAbstergentsStore } from '@/stores/handbook/abstergents';
import { useDepartmentsStore } from '@/stores/handbook/departments';
import { useProgramsStore } from '@/stores/handbook/programs';
import { useUniformsStore } from '@/stores/handbook/uniforms';
import { computed, onMounted } from 'vue';
import { Tabs, TabList, Tab, TabPanel, TabPanels } from 'primevue';
import TheDepartments from '@/components/handbook/TheDepartments.vue';
import TheUniforms from '@/components/handbook/TheUniforms.vue';
import TheAbstergents from '@/components/handbook/TheAbstergents.vue';
import ThePrograms from '@/components/handbook/ThePrograms.vue';
import permissions from '@/permissions/handbook';
import { useAuthStore } from '@/stores/auth';

const programsStore = useProgramsStore();
const departmentsStore = useDepartmentsStore();
const uniformsStore = useUniformsStore();
const abstergentsStore = useAbstergentsStore();
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
  }
];

const allowedTabs = computed(() => tabs.filter(t => authStore.isAllowed(t.permissions)));

onMounted(async () => {
  if (!programsStore.programs.length) await programsStore.loadPrograms();
  if (!departmentsStore.departments.length) await departmentsStore.loadDepartments();
  if (!uniformsStore.uniforms.length) await uniformsStore.loadUniforms();
  if (!abstergentsStore.abstergents.length) await abstergentsStore.loadAbstergents();
});
</script>

<template>
  <section class="p-5">
    <h1 class="font-bold text-lg">Довідник</h1>

    <Tabs :value="allowedTabs[0].value">
      <TabList>
        <Tab
          v-for="(tab, index) in allowedTabs"
          :key="index"
          :value="tab.value"
        >{{ tab.title }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="programsTab">
          <ThePrograms />
        </TabPanel>
        <TabPanel value="departmentsTab">
          <TheDepartments />
        </TabPanel>
        <TabPanel value="abstergentsTab">
          <TheAbstergents />
        </TabPanel>
        <TabPanel value="uniformsTab">
          <TheUniforms />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </section>
</template>
