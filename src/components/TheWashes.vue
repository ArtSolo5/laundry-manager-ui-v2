<script setup lang="ts">
import { useWashesStore, type WashPaylod } from '@/stores/washes';
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
import { useProgramsStore } from '@/stores/handbook/programs';

const washesStore = useWashesStore();
const programsStore = useProgramsStore();

const createDialogVisible: Ref<boolean> = ref(false);
const updateDialogVisible: Ref<boolean> = ref(false);
const removeDialogVisible: Ref<boolean> = ref(false);

const washData: Ref<WashPaylod> = ref({
  weight: '0',
  program_id: null,
});

const create = async () => {
  try {
    await washesStore.createWash(washData.value);
    toggleCreateDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const update = async () => {
  try {
    await washesStore.updateWash(washData.value);
    toggleUpdateDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const remove = async () => {
  try {
    if (washData.value.id) await washesStore.removeWash(washData.value.id);
    toggleRemoveDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const toggleCreateDialog = () => {
  createDialogVisible.value = !createDialogVisible.value;

  if (!createDialogVisible.value) {
    clearWashData();
    washesStore.createValidationErrors = [];
  }
};

const toggleUpdateDialog = (washId: number | null = null) => {
  const wash = washesStore.washes.find((w) => w.id === washId);

  if (wash) {
    washData.value = {
      id: wash.id,
      program_id: wash.program_id,
      weight: wash.weight,
    };
  }

  updateDialogVisible.value = !updateDialogVisible.value;

  if (!updateDialogVisible.value) {
    clearWashData();
    washesStore.updateValidationErrors = [];
  }
};

const toggleRemoveDialog = (washId: number | null = null) => {
  const wash = washesStore.washes.find((w) => w.id === washId);

  if (wash) {
    washData.value = {
      id: wash.id,
      program_id: wash.program_id,
      weight: wash.weight,
    };
  }

  removeDialogVisible.value = !removeDialogVisible.value;

  if (!removeDialogVisible.value) clearWashData();
};

const clearWashData = () => {
  washData.value = {
    weight: '0',
    program_id: null,
  };
};

onMounted(async () => {
  if (programsStore.programs.length === 0) {
    await programsStore.loadPrograms();
  }
});
</script>

<template>
  <div>
    <DataTable
      class="mt-5 w-full"
      selectionMode="single"
      :value="washesStore.washes"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="flex justify-between">
          <span class="text-xl font-bold">Прання</span>
          <Button @click="toggleCreateDialog()" icon="pi pi-plus" rounded raised />
        </div>
      </template>
      <Column field="name" header="Програма"></Column>
      <Column class="font-semibold" field="weight" header="Випрано, Вага Кг"></Column>
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
          <Column :footer="washesStore.sumWeight" :colspan="2" />
        </Row>
      </ColumnGroup>
    </DataTable>

    <Dialog
      v-model:visible="createDialogVisible"
      modal
      header="Нове прання"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="volume" class="font-semibold w-28">Програма</label>
        <Select
          v-model="washData.program_id"
          variant="filled"
          :options="programsStore.programs"
          optionValue="id"
          optionLabel="name"
          placeholder="Оберіть програму"
          class="w-full"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="weight" class="font-semibold w-28">Вага, Кг</label>
        <InputText id="weight" class="flex-auto w-full" v-model="washData.weight" />
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

      <Message class="mt-5" v-show="washesStore.createValidationErrors.length > 0" severity="error">
        Виникла помилка! Перевірте введені дані.
        <p
          class="font-normal"
          v-for="(error, index) in washesStore.createValidationErrors"
          :key="index"
        >
          {{ index + 1 }}. {{ error }}
        </p>
      </Message>
    </Dialog>

    <Dialog
      v-model:visible="updateDialogVisible"
      modal
      header="Редагування прання"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        {{ programsStore.programs.find((p) => p.id === washData.program_id)?.name }}
      </span>
      <div class="flex items-center gap-4 mb-4">
        <label for="weight" class="font-semibold w-28">Вага, Кг</label>
        <InputText id="weight" class="flex-auto w-full" v-model="washData.weight" />
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

      <Message class="mt-5" v-show="washesStore.updateValidationErrors.length > 0" severity="error">
        Виникла помилка! Перевірте введені дані.
        <p
          class="font-normal"
          v-for="(error, index) in washesStore.updateValidationErrors"
          :key="index"
        >
          {{ index + 1 }}. {{ error }}
        </p>
      </Message>
    </Dialog>

    <Dialog
      v-model:visible="removeDialogVisible"
      modal
      header="Видалення прання"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        Ви дійсно бажаєте видалити прання?
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
