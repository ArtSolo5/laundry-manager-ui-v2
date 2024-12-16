<script setup lang="ts">
import { useAbstergentsStore, type Abstergent } from '@/stores/handbook/abstergents';
import { DataTable, Column, Dialog, InputText, Button, Message } from 'primevue';
import { ref, type Ref } from 'vue';

const abstergentsStore = useAbstergentsStore();

const createDialogVisible: Ref<boolean> = ref(false);
const updateDialogVisible: Ref<boolean> = ref(false);
const removeDialogVisible: Ref<boolean> = ref(false);

const abstergentData: Ref<Abstergent> = ref({
  name: '',
});

const create = async () => {
  try {
    await abstergentsStore.createAbstergent(abstergentData.value);
    toggleCreateDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const update = async () => {
  try {
    await abstergentsStore.updateAbstergent(abstergentData.value);
    toggleUpdateDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const remove = async () => {
  try {
    if (abstergentData.value.id) await abstergentsStore.removeAbstergent(abstergentData.value.id);
    toggleRemoveDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const toggleCreateDialog = () => {
  createDialogVisible.value = !createDialogVisible.value;

  if (!createDialogVisible.value) {
    clearAbstergentData();
    abstergentsStore.createValidationErrors = [];
  }
};

const toggleUpdateDialog = (absId: number | null = null) => {
  const abstergent = abstergentsStore.abstergents.find((a) => a.id === absId);

  if (abstergent) {
    abstergentData.value = {
      id: abstergent.id,
      name: abstergent.name,
    };
  }

  updateDialogVisible.value = !updateDialogVisible.value;

  if (!updateDialogVisible.value) {
    clearAbstergentData();
    abstergentsStore.updateValidationErrors = [];
  }
};

const toggleRemoveDialog = (absId: number | null = null) => {
  const abstergent = abstergentsStore.abstergents.find((a) => a.id === absId);

  if (abstergent) {
    abstergentData.value = {
      id: abstergent.id,
      name: abstergent.name,
    };
  }

  removeDialogVisible.value = !removeDialogVisible.value;

  if (!removeDialogVisible.value) clearAbstergentData();
};

const clearAbstergentData = () => {
  abstergentData.value = {
    name: '',
  };
};
</script>

<template>
  <div>
    <DataTable
      class="mt-5 w-full"
      selectionMode="single"
      :value="abstergentsStore.abstergents"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="flex justify-between">
          <span class="text-xl font-bold">Засоби</span>
          <Button @click="toggleCreateDialog()" icon="pi pi-plus" rounded raised />
        </div>
      </template>
      <Column field="name" header="Назва"></Column>
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
    </DataTable>

    <Dialog
      v-model:visible="createDialogVisible"
      modal
      header="Новий засіб"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="name" class="font-semibold w-28">Назва</label>
        <InputText id="name" class="flex-auto w-full" v-model="abstergentData.name" />
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

      <Message
        class="mt-5"
        v-show="abstergentsStore.createValidationErrors.length > 0"
        severity="error"
      >
        Виникла помилка! Перевірте введені дані.
        <p
          class="font-normal"
          v-for="(error, index) in abstergentsStore.createValidationErrors"
          :key="index"
        >
          {{ index + 1 }}. {{ error }}
        </p>
      </Message>
    </Dialog>

    <Dialog
      v-model:visible="updateDialogVisible"
      modal
      header="Редагування засобу"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="name" class="font-semibold w-28">Назва</label>
        <InputText id="name" class="flex-auto w-full" v-model="abstergentData.name" />
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

      <Message
        class="mt-5"
        v-show="abstergentsStore.updateValidationErrors.length > 0"
        severity="error"
      >
        Виникла помилка! Перевірте введені дані.
        <p
          class="font-normal"
          v-for="(error, index) in abstergentsStore.updateValidationErrors"
          :key="index"
        >
          {{ index + 1 }}. {{ error }}
        </p>
      </Message>
    </Dialog>

    <Dialog
      v-model:visible="removeDialogVisible"
      modal
      header="Видалення засобу"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        Ви дійсно бажаєте видалити засіб?
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
