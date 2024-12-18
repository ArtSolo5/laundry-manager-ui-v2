<script setup lang="ts">
import { useAbsArrivalsStore, type AbsArrival } from '@/stores/arrivals/abstergent-arrivals';
import {
  DataTable,
  Column,
  Row,
  ColumnGroup,
  Dialog,
  InputText,
  Button,
  Message,
  Select,
  Toast,
} from 'primevue';
import { onMounted, ref, type Ref } from 'vue';
import { useAbstergentsStore } from '@/stores/handbook/abstergents';

const absArrivalsStore = useAbsArrivalsStore();
const absArrStore = useAbsArrivalsStore();
const abstergentsStore = useAbstergentsStore();

const createDialogVisible: Ref<boolean> = ref(false);
const updateDialogVisible: Ref<boolean> = ref(false);
const removeDialogVisible: Ref<boolean> = ref(false);

const arrData: Ref<AbsArrival> = ref({
  volume: '0',
  abstergent_id: null,
});

const create = async () => {
  try {
    await absArrStore.createArrival(arrData.value);
    toggleCreateDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const update = async () => {
  try {
    await absArrStore.updateArrival(arrData.value);
    toggleUpdateDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const remove = async () => {
  try {
    if (arrData.value.id) await absArrStore.removeArrival(arrData.value.id);
    toggleRemoveDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const toggleCreateDialog = () => {
  createDialogVisible.value = !createDialogVisible.value;

  if (!createDialogVisible.value) {
    clearArrData();
    absArrStore.createValidationErrors = [];
  }
};

const toggleUpdateDialog = (arrId: number | null = null) => {
  const arrival = absArrStore.arrivals.find((a) => a.id === arrId);

  if (arrival) {
    arrData.value = {
      id: arrival.id,
      abstergent_id: arrival.abstergent_id,
      volume: arrival.volume,
    };
  }

  updateDialogVisible.value = !updateDialogVisible.value;

  if (!updateDialogVisible.value) {
    clearArrData();
    absArrStore.updateValidationErrors = [];
  }
};

const toggleRemoveDialog = (arrId: number | null = null) => {
  const arrival = absArrStore.arrivals.find((a) => a.id === arrId);

  if (arrival) {
    arrData.value = {
      id: arrival.id,
      abstergent_id: arrival.abstergent_id,
      volume: arrival.volume,
    };
  }

  removeDialogVisible.value = !removeDialogVisible.value;

  if (!removeDialogVisible.value) clearArrData();
};

const clearArrData = () => {
  arrData.value = {
    volume: '0',
    abstergent_id: null,
  };
};

onMounted(async () => {
  await absArrivalsStore.loadArrivals();
  if (!abstergentsStore.abstergents.length) await abstergentsStore.loadAbstergents();
});
</script>

<template>
  <div>
    <DataTable
      class="mt-5 w-full"
      selectionMode="single"
      :value="absArrStore.arrivals"
      tableStyle="min-width: 50rem"
      size="small"
    >
      <template #header>
        <div class="flex justify-between">
          <span class="text-xl font-bold">Засоби</span>
          <Button @click="toggleCreateDialog()" icon="pi pi-plus" rounded raised />
        </div>
      </template>
      <Column field="abstergent.name" header="Найменування засоби"></Column>
      <Column class="font-semibold" field="volume" header="Надійшло, Об'єм Мл"></Column>
      <Column class="text-end">
        <template #body="{ data }">
          <Button
            icon="pi pi-pen-to-square"
            @click="toggleUpdateDialog(data.id)"
            severity="success"
            rounded
          ></Button>
          <Button
            @click="toggleRemoveDialog(data.id)"
            class="ml-2"
            icon="pi pi-trash"
            severity="danger"
            rounded
          ></Button>
        </template>
      </Column>
      <ColumnGroup type="footer">
        <Row>
          <Column footer="Всого" />
          <Column :footer="absArrStore.sumVolume" :colspan="2" />
        </Row>
      </ColumnGroup>
    </DataTable>

    <Dialog
      v-model:visible="createDialogVisible"
      modal
      header="Нове надходження"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="volume" class="font-semibold w-28">Засіб</label>
        <Select
          v-model="arrData.abstergent_id"
          variant="filled"
          :options="abstergentsStore.abstergents"
          optionValue="id"
          optionLabel="name"
          placeholder="Оберіть засоби"
          class="w-full"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="volume" class="font-semibold w-28">Об'єм, Мл</label>
        <InputText id="volume" class="flex-auto w-full" v-model="arrData.volume" />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Скасувати"
          severity="secondary"
          @click="toggleCreateDialog()"
        ></Button>
        <Button type="button" label="Зберегти" @click="create()"></Button>
      </div>

      <Message class="mt-5" v-show="absArrStore.createValidationErrors.length > 0" severity="error">
        Виникла помилка! Перевірте введені дані.
        <p
          class="font-normal"
          v-for="(error, index) in absArrStore.createValidationErrors"
          :key="index"
        >
          {{ index + 1 }}. {{ error }}
        </p>
      </Message>
    </Dialog>

    <Dialog
      v-model:visible="updateDialogVisible"
      modal
      header="Редагування надходження"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        {{ abstergentsStore.abstergents.find((d) => d.id === arrData.abstergent_id)?.name }}
      </span>
      <div class="flex items-center gap-4 mb-4">
        <label for="volume" class="font-semibold w-28">Об'єм, Мл</label>
        <InputText id="volume" class="flex-auto w-full" v-model="arrData.volume" />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Скасувати"
          severity="secondary"
          @click="toggleUpdateDialog()"
        ></Button>
        <Button type="button" label="Зберегти" @click="update()"></Button>
      </div>

      <Message class="mt-5" v-show="absArrStore.updateValidationErrors.length > 0" severity="error">
        Виникла помилка! Перевірте введені дані.
        <p
          class="font-normal"
          v-for="(error, index) in absArrStore.updateValidationErrors"
          :key="index"
        >
          {{ index + 1 }}. {{ error }}
        </p>
      </Message>
    </Dialog>

    <Dialog
      v-model:visible="removeDialogVisible"
      modal
      header="Видалення надходження"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        Ви дійсно бажаєте видалити надходження?
      </span>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Скасувати"
          severity="secondary"
          @click="toggleRemoveDialog()"
        ></Button>
        <Button type="button" label="Підтвердити" severity="danger" @click="remove()"></Button>
      </div>
    </Dialog>

    <Toast group="abstergent-arrivals-errors" position="top-center" />
  </div>
</template>
