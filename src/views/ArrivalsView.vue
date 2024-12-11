<script setup lang="ts">
import DatePicker from 'primevue/datepicker';
import { useArrivalsStore } from '@/stores/arrivals';
import { onMounted } from 'vue';

const arrivals = useArrivalsStore();

onMounted(async () => {
  await arrivals.loadDepArrivals();
});
</script>

<template>
  <section class="p-10">
    <h1 class="font-bold test-lg">Надходження</h1>

    <DatePicker
      class="mt-5"
      v-model="arrivals.date"
      dateFormat="dd.mm.yy"
      showIcon
      fluid
      iconDisplay="input"
    />
  </section>
</template>
