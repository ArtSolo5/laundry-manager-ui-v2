<script setup lang="ts">
import { useAbstergentsStore } from '@/stores/handbook/abstergents';
import { useDepartmentsStore } from '@/stores/handbook/departments';
import { useProgramsStore } from '@/stores/handbook/programs';
import { useUniformsStore } from '@/stores/handbook/uniforms';
import { onMounted } from 'vue';
import { Tabs, TabList, Tab, TabPanel, TabPanels } from 'primevue';
import TheDepartments from '@/components/handbook/TheDepartments.vue';
import TheUniforms from '@/components/handbook/TheUniforms.vue';
import TheAbstergents from '@/components/handbook/TheAbstergents.vue';
import ThePrograms from '@/components/handbook/ThePrograms.vue';

const programsStore = useProgramsStore();
const departmentsStore = useDepartmentsStore();
const uniformsStore = useUniformsStore();
const abstergentsStore = useAbstergentsStore();

onMounted(async () => {
  await programsStore.loadPrograms();
  await departmentsStore.loadDepartments();
  await uniformsStore.loadUniforms();
  await abstergentsStore.loadAbstergents();
});
</script>

<template>
  <section class="p-10">
    <h1 class="font-bold text-lg">Довідник</h1>

    <Tabs value="programsTab">
      <TabList>
        <Tab value="programsTab">Програми</Tab>
        <Tab value="departmentsTab">Відділи</Tab>
        <Tab value="abstergentsTab">Засоби</Tab>
        <Tab value="uniformsTab">Одяг</Tab>
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
