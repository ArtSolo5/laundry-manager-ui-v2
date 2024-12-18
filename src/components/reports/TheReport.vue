<script setup lang="ts">
import { DataTable, Column, Toast } from 'primevue';
import { useReportStore } from '@/stores/report';
import { onMounted } from 'vue';

const reportStore = useReportStore();

onMounted(async () => {
  await reportStore.loadReport();
  await reportStore.loadReports();
});
</script>

<template>
  <DataTable class="mt-5 w-full" :value="reportStore.reportData" selectionMode="single" tableStyle="min-width: 50rem" size="small">
    <Column field="department" header="Найменування цеху, відділу"></Column>
    <Column field="weight" header="Вага, Кг"></Column>
    <template v-for="(abstergent, index) in reportStore.abstergents" :key="index">
      <Column :field="abstergent.name" :header="`${abstergent.name}, Мл`">
        <template #body="slotProps">
          <span>{{ reportStore.getAbstergentVolume(slotProps.data, abstergent.name) }}</span>
        </template>
      </Column>
    </template>
    <Column field="sum" header="Всього, Мл"></Column>
  </DataTable>

  <Toast group="report-errors" position="top-center"/>
</template>
