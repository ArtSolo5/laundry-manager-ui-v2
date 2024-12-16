<script setup lang="ts">
import { useDepartmentsStore, type Department } from '@/stores/handbook/departments';
import { DataTable, Column, Dialog, InputText, Button, Message } from 'primevue';
import { ref, type Ref } from 'vue';

const departmentsStore = useDepartmentsStore();

const createDialogVisible: Ref<boolean> = ref(false);
const updateDialogVisible: Ref<boolean> = ref(false);
const removeDialogVisible: Ref<boolean> = ref(false);

const departmentData: Ref<Department> = ref({
  name: '',
});

const create = async () => {
  try {
    await departmentsStore.createDepartment(departmentData.value);
    toggleCreateDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const update = async () => {
  try {
    await departmentsStore.updateDepartment(departmentData.value);
    toggleUpdateDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const remove = async () => {
  try {
    if (departmentData.value.id) await departmentsStore.removeDepartment(departmentData.value.id);
    toggleRemoveDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const toggleCreateDialog = () => {
  createDialogVisible.value = !createDialogVisible.value;

  if (!createDialogVisible.value) {
    clearDepartmentData();
    departmentsStore.createValidationErrors = [];
  }
};

const toggleUpdateDialog = (depId: number | null = null) => {
  const department = departmentsStore.departments.find((d) => d.id === depId);

  if (department) {
    departmentData.value = {
      id: department.id,
      name: department.name,
    };
  }

  updateDialogVisible.value = !updateDialogVisible.value;

  if (!updateDialogVisible.value) {
    clearDepartmentData();
    departmentsStore.updateValidationErrors = [];
  }
};

const toggleRemoveDialog = (depId: number | null = null) => {
  const department = departmentsStore.departments.find((d) => d.id === depId);

  if (department) {
    departmentData.value = {
      id: department.id,
      name: department.name,
    };
  }

  removeDialogVisible.value = !removeDialogVisible.value;

  if (!removeDialogVisible.value) clearDepartmentData();
};

const clearDepartmentData = () => {
  departmentData.value = {
    name: '',
  };
};
</script>

<template>
  <div>
    <DataTable
      class="mt-5 w-full"
      selectionMode="single"
      :value="departmentsStore.departments"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="flex justify-between">
          <span class="text-xl font-bold">Відділи</span>
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
      header="Новий відділ"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="name" class="font-semibold w-28">Назва</label>
        <InputText id="name" class="flex-auto w-full" v-model="departmentData.name" />
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
        v-show="departmentsStore.createValidationErrors.length > 0"
        severity="error"
      >
        Виникла помилка! Перевірте введені дані.
        <p
          class="font-normal"
          v-for="(error, index) in departmentsStore.createValidationErrors"
          :key="index"
        >
          {{ index + 1 }}. {{ error }}
        </p>
      </Message>
    </Dialog>

    <Dialog
      v-model:visible="updateDialogVisible"
      modal
      header="Редагування відділу"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="name" class="font-semibold w-28">Назва</label>
        <InputText id="name" class="flex-auto w-full" v-model="departmentData.name" />
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
        v-show="departmentsStore.updateValidationErrors.length > 0"
        severity="error"
      >
        Виникла помилка! Перевірте введені дані.
        <p
          class="font-normal"
          v-for="(error, index) in departmentsStore.updateValidationErrors"
          :key="index"
        >
          {{ index + 1 }}. {{ error }}
        </p>
      </Message>
    </Dialog>

    <Dialog
      v-model:visible="removeDialogVisible"
      modal
      header="Видалення відділу"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        Ви дійсно бажаєте видалити відділ?
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
