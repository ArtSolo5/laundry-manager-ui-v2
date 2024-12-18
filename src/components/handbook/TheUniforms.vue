<script setup lang="ts">
import { useUniformsStore, type Uniform } from '@/stores/handbook/uniforms';
import { DataTable, Column, Dialog, InputText, Button, Message } from 'primevue';
import { onMounted, ref, type Ref } from 'vue';

const uniformsStore = useUniformsStore();

const createDialogVisible: Ref<boolean> = ref(false);
const updateDialogVisible: Ref<boolean> = ref(false);
const removeDialogVisible: Ref<boolean> = ref(false);

const uniformData: Ref<Uniform> = ref({
  name: '',
});

const create = async () => {
  try {
    await uniformsStore.createUniform(uniformData.value);
    toggleCreateDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const update = async () => {
  try {
    await uniformsStore.updateUniform(uniformData.value);
    toggleUpdateDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const remove = async () => {
  try {
    if (uniformData.value.id) await uniformsStore.removeUniform(uniformData.value.id);
    toggleRemoveDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const toggleCreateDialog = () => {
  createDialogVisible.value = !createDialogVisible.value;

  if (!createDialogVisible.value) {
    clearUniformData();
    uniformsStore.createValidationErrors = [];
  }
};

const toggleUpdateDialog = (uniformId: number | null = null) => {
  const uniform = uniformsStore.uniforms.find((u) => u.id === uniformId);

  if (uniform) {
    uniformData.value = {
      id: uniform.id,
      name: uniform.name,
    };
  }

  updateDialogVisible.value = !updateDialogVisible.value;

  if (!updateDialogVisible.value) {
    clearUniformData();
    uniformsStore.updateValidationErrors = [];
  }
};

const toggleRemoveDialog = (uniformId: number | null = null) => {
  const uniform = uniformsStore.uniforms.find((u) => u.id === uniformId);

  if (uniform) {
    uniformData.value = {
      id: uniform.id,
      name: uniform.name,
    };
  }

  removeDialogVisible.value = !removeDialogVisible.value;

  if (!removeDialogVisible.value) clearUniformData();
};

const clearUniformData = () => {
  uniformData.value = {
    name: '',
  };
};

onMounted(async () => {
  if (!uniformsStore.uniforms.length) await uniformsStore.loadUniforms();
});
</script>

<template>
  <div>
    <DataTable
      class="mt-5 w-full"
      selectionMode="single"
      :value="uniformsStore.uniforms"
      tableStyle="min-width: 50rem"
      size="small"
    >
      <template #header>
        <div class="flex justify-between">
          <span class="text-xl font-bold">Одяг</span>
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
      header="Новий одяг"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="name" class="font-semibold w-28">Назва</label>
        <InputText id="name" class="flex-auto w-full" v-model="uniformData.name" />
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
        v-show="uniformsStore.createValidationErrors.length > 0"
        severity="error"
      >
        Виникла помилка! Перевірте введені дані.
        <p
          class="font-normal"
          v-for="(error, index) in uniformsStore.createValidationErrors"
          :key="index"
        >
          {{ index + 1 }}. {{ error }}
        </p>
      </Message>
    </Dialog>

    <Dialog
      v-model:visible="updateDialogVisible"
      modal
      header="Редагування одягу"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="name" class="font-semibold w-28">Назва</label>
        <InputText id="name" class="flex-auto w-full" v-model="uniformData.name" />
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
        v-show="uniformsStore.updateValidationErrors.length > 0"
        severity="error"
      >
        Виникла помилка! Перевірте введені дані.
        <p
          class="font-normal"
          v-for="(error, index) in uniformsStore.updateValidationErrors"
          :key="index"
        >
          {{ index + 1 }}. {{ error }}
        </p>
      </Message>
    </Dialog>

    <Dialog
      v-model:visible="removeDialogVisible"
      modal
      header="Видалення одягу"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        Ви дійсно бажаєте видалити одяг?
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
