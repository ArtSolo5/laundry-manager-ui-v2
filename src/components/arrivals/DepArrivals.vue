<script setup lang="ts">
import { useDepArrivalsStore, type DepArrival } from '@/stores/arrivals/department-arrivals';
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
} from 'primevue';
import { onMounted, ref, type Ref } from 'vue';
import { useDepartmentsStore } from '@/stores/handbook/departments';

const depArrStore = useDepArrivalsStore();
const departmentsStore = useDepartmentsStore();
const depArrivalsStore = useDepArrivalsStore();

const createDialogVisible: Ref<boolean> = ref(false);
const updateDialogVisible: Ref<boolean> = ref(false);
const removeDialogVisible: Ref<boolean> = ref(false);

const arrData: Ref<DepArrival> = ref({
  weight: '0',
  department_id: null,
});

const create = async () => {
  try {
    await depArrStore.createArrival(arrData.value);
    toggleCreateDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const update = async () => {
  try {
    await depArrStore.updateArrival(arrData.value);
    toggleUpdateDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const remove = async () => {
  try {
    if (arrData.value.id) await depArrStore.removeArrival(arrData.value.id);
    toggleRemoveDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const toggleCreateDialog = () => {
  createDialogVisible.value = !createDialogVisible.value;

  if (!createDialogVisible.value) {
    clearArrData();
    depArrStore.createValidationErrors = [];
  }
};

const toggleRemoveDialog = (arrId: number | null = null) => {
  const arrival = depArrStore.arrivals.find((a) => a.id === arrId);

  if (arrival) {
    arrData.value = {
      id: arrival.id,
      department_id: arrival.department_id,
      weight: arrival.weight,
    };
  }

  removeDialogVisible.value = !removeDialogVisible.value;

  if (!removeDialogVisible.value) clearArrData();
};

const toggleUpdateDialog = (arrId: number | null = null) => {
  const arrival = depArrStore.arrivals.find((a) => a.id === arrId);

  if (arrival) {
    arrData.value = {
      id: arrival.id,
      department_id: arrival.department_id,
      weight: arrival.weight,
    };
  }

  updateDialogVisible.value = !updateDialogVisible.value;

  if (!updateDialogVisible.value) {
    clearArrData();
    depArrStore.updateValidationErrors = [];
  }
};

const clearArrData = () => {
  arrData.value = {
    weight: '0',
    department_id: null,
  };
};

onMounted(async () => {
  await depArrivalsStore.loadArrivals();
  if (!departmentsStore.departments.length) await departmentsStore.loadDepartments();
});
</script>

<template>
  <div>
    <DataTable
      class="mt-5 w-full"
      selectionMode="single"
      :value="depArrStore.arrivals"
      tableStyle="min-width: 50rem"
      size="small"
    >
      <template #header>
        <div class="flex justify-between">
          <span class="text-xl font-bold">Одяг</span>
          <Button @click="toggleCreateDialog()" icon="pi pi-plus" rounded raised />
        </div>
      </template>
      <Column field="name" header="Найменування цеху, відділу"></Column>
      <Column class="font-semibold" field="weight" header="Надійшло, Вага Кг"></Column>
      <Column field="perc" header="Питома вага, %"></Column>
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
          <Column :footer="depArrStore.sumWeight" />
          <Column :footer="depArrStore.percentage" :colspan="2" />
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
        <label for="weight" class="font-semibold w-24">Відділ</label>
        <Select
          v-model="arrData.department_id"
          variant="filled"
          :options="departmentsStore.departments"
          optionValue="id"
          optionLabel="name"
          placeholder="Оберіть відділ"
          class="w-full"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="weight" class="font-semibold w-24">Вага, Кг</label>
        <InputText id="weight" class="flex-auto w-full" v-model="arrData.weight" />
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

      <Message class="mt-5" v-show="depArrStore.createValidationErrors.length > 0" severity="error">
        Виникла помилка! Перевірте введені дані.
        <p
          class="font-normal"
          v-for="(error, index) in depArrStore.createValidationErrors"
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
        {{ departmentsStore.departments.find((d) => d.id === arrData.department_id)?.name }}
      </span>
      <div class="flex items-center gap-4 mb-4">
        <label for="weight" class="font-semibold w-24">Вага, Кг</label>
        <InputText id="weight" class="flex-auto w-full" v-model="arrData.weight" />
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

      <Message class="mt-5" v-show="depArrStore.updateValidationErrors.length > 0" severity="error">
        Виникла помилка! Перевірте введені дані.
        <p
          class="font-normal"
          v-for="(error, index) in depArrStore.updateValidationErrors"
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
  </div>
</template>
