<script setup lang="ts">
import DatePicker from 'primevue/datepicker';
import { useDepArrivalsStore } from '@/stores/arrivals/department-arrivals';
import { onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Row from 'primevue/row';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ColumnGroup from 'primevue/columngroup';
import Message from 'primevue/message';

const store = useDepArrivalsStore();

onMounted(async () => {
  await store.loadArrivals();
});
</script>

<template>
  <section class="p-10">
    <h1 class="font-bold text-lg">Надходження</h1>

    <DatePicker
      class="mt-5 w-44"
      v-model="store.date"
      dateFormat="dd.mm.yy"
      showIcon
      fluid
      iconDisplay="input"
    />

    <DataTable
      class="mt-5 w-full"
      selectionMode="single"
      :value="store.arrivals"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="flex justify-end">
          <Button icon="pi pi-plus" rounded raised />
        </div>
      </template>
      <Column field="name" header="Найменування цеху, відділу"></Column>
      <Column class="font-semibold" field="weight" header="Надійшло, Вага Кг"></Column>
      <Column field="perc" header="Питома вага, %"></Column>
      <Column class="text-end">
        <template #body="{ data }">
          <Button
            icon="pi pi-pen-to-square"
            @click="store.openUpdateDialog(data.id)"
            severity="success"
            rounded
          ></Button>
        </template>
      </Column>
      <ColumnGroup type="footer">
        <Row>
          <Column footer="Всого" />
          <Column :footer="store.sumWeight" />
          <Column :footer="store.percentage" :colspan="2" />
        </Row>
      </ColumnGroup>
    </DataTable>

    <Dialog
      v-model:visible="store.updateDialogVisible"
      modal
      header="Редагувати надходження"
      :style="{ width: '25rem' }"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8">{{
        store.selectedArrival.name
      }}</span>
      <div class="flex items-center gap-4 mb-4">
        <label for="weight" class="font-semibold w-24">Вага, Кг</label>
        <InputText id="weight" class="flex-auto" v-model="store.selectedArrival.weight" />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Скасувати"
          severity="secondary"
          @click="store.updateDialogVisible = false"
        ></Button>
        <Button type="button" label="Зберегти" @click="console.log(store.selectedArrival)"></Button>
      </div>
    </Dialog>

    <Dialog
      v-model:visible="store.updateDialogVisible"
      modal
      header="Нове надходження"
      :style="{ width: '25rem' }"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8">{{
        store.selectedArrival.name
      }}</span>
      <div class="flex items-center gap-4 mb-4">
        <label for="weight" class="font-semibold w-24">Вага, Кг</label>
        <InputText id="weight" class="flex-auto" v-model="store.selectedArrival.weight" />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Скасувати"
          severity="secondary"
          @click="store.updateDialogVisible = false"
        ></Button>
        <Button type="button" label="Зберегти" @click="store.updateArrival()"></Button>
      </div>

      <Message class="mt-5" v-for="(error, index) in store.updateErrors" :key="index" severity="error">{{ index + 1}}. {{ error }}</Message>
    </Dialog>
  </section>
</template>
