<script setup lang="ts">
import { formatToReadable, toKievTimeZone } from '@/helpers/date.helper';
import { useReportStore } from '@/stores/report';
import { DataTable, Column, Button } from 'primevue';

const reportStore = useReportStore();
</script>

<template>
  <DataTable class="mt-5 w-full" :value="reportStore.reports" tableStyle="min-width: 50rem" paginator :rows="5">
    <Column field="filename" header="Назва файлу"></Column>
    <Column field="created_at" header="Дата створення">
      <template #body="slotProps">
        <span>{{ formatToReadable(toKievTimeZone(new Date(slotProps.data.created_at))) }}</span>
      </template>
    </Column>
    <Column class="text-end">
        <template #body="{ data }">
          <Button
            icon="pi pi-download"
            @click="reportStore.downloadReport(data.filename)"
            severity="success"
            rounded
          ></Button>
        </template>
      </Column>
  </DataTable>
</template>