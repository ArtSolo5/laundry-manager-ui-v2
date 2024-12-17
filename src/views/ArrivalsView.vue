<script setup lang="ts">
import DatePicker from 'primevue/datepicker';
import { useDepArrivalsStore } from '@/stores/arrivals/department-arrivals';
import { useWashDaysStore } from '@/stores/wash-days';
import { onMounted } from 'vue';
import DepArrivals from '@/components/arrivals/DepArrivals.vue';
import { Tabs, TabList, Tab, TabPanel, TabPanels } from 'primevue';
import AbsArrivals from '@/components/arrivals/AbsArrivals.vue';
import { useAbsArrivalsStore } from '@/stores/arrivals/abstergent-arrivals';

const depArrivalsStore = useDepArrivalsStore();
const absArrivalsStore = useAbsArrivalsStore();
const washDaysStore = useWashDaysStore();

onMounted(async () => {
  await washDaysStore.loadWashDay();
  await depArrivalsStore.loadArrivals();
  await absArrivalsStore.loadArrivals();
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

    <Tabs value="depTab">
      <TabList>
        <Tab value="depTab">Одяг</Tab>
        <Tab value="absTab">Засоби</Tab>
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
