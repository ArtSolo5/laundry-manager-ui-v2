<script setup lang="ts">
import TheWashes from '@/components/TheWashes.vue';
import { DatePicker } from 'primevue';
import { useWashDaysStore } from '@/stores/wash-days';
import { useWashesStore } from '@/stores/washes';
import { onMounted } from 'vue';

const washesStore = useWashesStore();
const washDaysStore = useWashDaysStore();

onMounted(async () => {
  await washDaysStore.loadWashDay();
  await washesStore.loadWashes();
});
</script>

<template>
  <section class="p-5">
    <h1 class="font-bold text-lg">Прання</h1>

    <DatePicker
      class="mt-5 w-44"
      v-model="washDaysStore.date"
      dateFormat="dd.mm.yy"
      showIcon
      fluid
      iconDisplay="input"
      :manualInput="false"
    />

    <TheWashes />
  </section>
</template>
