<script setup lang="ts">
import DatePicker from 'primevue/datepicker';
import { useWashDaysStore } from '@/stores/wash-days';
import { computed, onMounted } from 'vue';
import DepArrivals from '@/components/arrivals/DepArrivals.vue';
import { Tabs, TabList, Tab, TabPanel, TabPanels } from 'primevue';
import AbsArrivals from '@/components/arrivals/AbsArrivals.vue';
import permissions from '@/permissions/arrivals';
import { useAuthStore } from '@/stores/auth';

const washDaysStore = useWashDaysStore();
const authStore = useAuthStore();

const tabs = [
  {
    title: 'Одяг',
    value: 'depTab',
    permissions: permissions.uniforms,
  },
  {
    title: 'Засоби',
    value: 'absTab',
    permissions: permissions.abstergents,
  }
];

const allowedTabs = computed(() => tabs.filter(t => authStore.isAllowed(t.permissions)));

onMounted(async () => {
  if (!washDaysStore.day) await washDaysStore.loadWashDay();
});
</script>

<template>
  <section class="p-5">
    <h1 class="font-bold text-lg">Надходження</h1>

    <DatePicker
      class="mt-5 w-44"
      v-model="washDaysStore.date"
      dateFormat="dd.mm.yy"
      showIcon
      fluid
      iconDisplay="input"
      :manualInput="false"
    />

    <Tabs :value="allowedTabs[0].value">
      <TabList>
        <Tab
          v-for="(tab, index) in allowedTabs"
          :key="index"
          :value="tab.value"
        >{{ tab.title }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="depTab">
          <DepArrivals />
        </TabPanel>
        <TabPanel value="absTab">
          <AbsArrivals />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </section>
</template>
