<script setup lang="ts">
import { DatePicker, Button } from 'primevue';
import { useReportStore } from '@/stores/report';
import TheReport from '@/components/reports/TheReport.vue';
import ReportHistory from '@/components/reports/ReportHistory.vue';

const reportStore = useReportStore();
</script>

<template>
  <section class="p-5">
    <h1 class="font-bold text-lg">Звіт</h1>

    <div class="flex items-center justify-between">
      <DatePicker
        class="mt-5 w-60"
        selectionMode="range"
        v-model="reportStore.dateRange"
        dateFormat="dd.mm.yy"
        showIcon
        fluid
        iconDisplay="input"
        :manualInput="false"
      />

      <Button
        @click="reportStore.generateReport()"
        rounded
      >Сформувати звіт</Button>
    </div>

    <TheReport />

    <h1 class="font-bold text-lg mt-5">Історія</h1>

    <ReportHistory />
  </section>
</template>
