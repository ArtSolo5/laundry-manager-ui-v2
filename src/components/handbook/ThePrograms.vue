<script setup lang="ts">
import { useAbstergentsStore } from '@/stores/handbook/abstergents';
import { useProgramsStore, type Program } from '@/stores/handbook/programs';
import { useUniformsStore } from '@/stores/handbook/uniforms';
import {
  DataTable,
  Column,
  Dialog,
  InputText,
  Button,
  Message,
  Select,
  ToggleSwitch,
  Divider,
  Toast,
} from 'primevue';
import { onMounted, ref, type Ref } from 'vue';

const programsStore = useProgramsStore();
const uniformsStore = useUniformsStore();
const abstergentStore = useAbstergentsStore();

const createDialogVisible: Ref<boolean> = ref(false);
const updateDialogVisible: Ref<boolean> = ref(false);
const removeDialogVisible: Ref<boolean> = ref(false);

const programData: Ref<Program> = ref({
  uniform_id: null,
  code: '',
  temperature: '',
  is_heavy_soiling: false,
  norms: [],
});

const create = async () => {
  try {
    await programsStore.createProgram(programData.value);
    toggleCreateDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const update = async () => {
  try {
    await programsStore.updateProgram(programData.value);
    toggleUpdateDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const remove = async () => {
  try {
    if (programData.value.id) await programsStore.removeProgram(programData.value.id);
    toggleRemoveDialog();
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
  }
};

const toggleCreateDialog = () => {
  createDialogVisible.value = !createDialogVisible.value;

  if (!createDialogVisible.value) {
    clearProgramData();
    programsStore.createValidationErrors = [];
  }
};

const toggleUpdateDialog = (programId: number | null = null) => {
  const program = programsStore.programs.find((p) => p.id === programId);

  if (program) {
    programData.value = {
      id: program.id,
      code: program.code,
      temperature: program.temperature,
      uniform_id: program.uniform?.id,
      is_heavy_soiling: program.is_heavy_soiling,
      norms: program.norms,
    };
  }

  updateDialogVisible.value = !updateDialogVisible.value;

  if (!updateDialogVisible.value) {
    clearProgramData();
    programsStore.updateValidationErrors = [];
  }
};

const toggleRemoveDialog = (programId: number | null = null) => {
  const program = programsStore.programs.find((p) => p.id === programId);

  if (program) {
    programData.value = {
      id: program.id,
      code: program.code,
      temperature: program.temperature,
      uniform_id: program.uniform?.id,
      is_heavy_soiling: program.is_heavy_soiling,
      norms: program.norms,
    };
  }

  removeDialogVisible.value = !removeDialogVisible.value;

  if (!removeDialogVisible.value) clearProgramData();
};

const clearProgramData = () => {
  programData.value = {
    uniform_id: null,
    code: '',
    temperature: '',
    is_heavy_soiling: false,
    norms: [],
  };
};

const addNorm = () => {
  programData.value.norms.push({
    abstergent_id: null,
    values: [
      {
        volume: '0',
      },
    ],
  });
};

const removeNorm = (index: number) => {
  programData.value.norms.splice(index, 1);
};

onMounted(async () => {
  if (!programsStore.programs.length) await programsStore.loadPrograms();
});
</script>

<template>
  <div>
    <DataTable
      class="mt-5 w-full"
      selectionMode="single"
      :value="programsStore.programs"
      tableStyle="min-width: 50rem"
      size="small"
    >
      <template #header>
        <div class="flex justify-between">
          <span class="text-xl font-bold">Програми</span>
          <Button @click="toggleCreateDialog()" icon="pi pi-plus" rounded raised />
        </div>
      </template>
      <Column field="code" header="Код"></Column>
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
      header="Нова програма"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <div class="flex">
        <div>
          <div class="flex items-center gap-4 mb-4">
            <label for="weight" class="font-semibold w-24">Одяг</label>
            <Select
              v-model="programData.uniform_id"
              variant="filled"
              :options="uniformsStore.uniforms"
              optionValue="id"
              optionLabel="name"
              placeholder="Оберіть одяг"
              class="w-full"
            />
          </div>
          <div class="flex items-center gap-4 mb-4">
            <label for="code" class="font-semibold w-24">Код</label>
            <InputText id="code" class="flex-auto w-full" v-model="programData.code" />
          </div>
          <div class="flex items-center gap-4 mb-4">
            <label for="temperature" class="font-semibold w-24">Т, °C</label>
            <InputText
              id="temperature"
              class="flex-auto w-full"
              v-model="programData.temperature"
            />
          </div>
          <div class="flex justify-between items-center gap-4 mb-4">
            <label class="font-semibold" for="isHeavySoiling">Сильного забруднення</label>
            <ToggleSwitch id="isHeavySoiling" v-model="programData.is_heavy_soiling" />
          </div>
        </div>
        <Divider layout="vertical" />
        <div>
          <p class="font-semibold">Норми</p>

          <div
            class="flex items-center gap-2 mt-3"
            v-for="(norm, index) in programData.norms"
            :key="index"
          >
            <Select
              v-model="norm.abstergent_id"
              variant="filled"
              :options="abstergentStore.abstergents"
              optionValue="id"
              optionLabel="name"
              placeholder="Оберіть засіб"
              class="w-full"
            />

            <label for="volum" class="font-semibold text-nowrap">Об'єм, Мл</label>
            <InputText id="volume" class="flex-auto w-16" v-model="norm.values[0].volume" />

            <div>
              <Button
                @click="removeNorm(index)"
                icon="pi pi-trash"
                severity="danger"
                rounded
              ></Button>
            </div>
          </div>

          <Button @click="addNorm()" class="mt-3" icon="pi pi-plus" rounded raised />
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-5">
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
        v-show="programsStore.createValidationErrors.length > 0"
        severity="error"
      >
        Виникла помилка! Перевірте введені дані.
        <p
          class="font-normal"
          v-for="(error, index) in programsStore.createValidationErrors"
          :key="index"
        >
          {{ index + 1 }}. {{ error }}
        </p>
      </Message>
    </Dialog>

    <Dialog
      v-model:visible="updateDialogVisible"
      modal
      header="Редагування програми"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <div class="flex">
        <div>
          <div class="flex items-center gap-4 mb-4">
            <label for="weight" class="font-semibold w-24">Одяг</label>
            <Select
              v-model="programData.uniform_id"
              variant="filled"
              :options="uniformsStore.uniforms"
              optionValue="id"
              optionLabel="name"
              placeholder="Оберіть одяг"
              class="w-full"
            />
          </div>
          <div class="flex items-center gap-4 mb-4">
            <label for="code" class="font-semibold w-24">Код</label>
            <InputText id="code" class="flex-auto w-full" v-model="programData.code" />
          </div>
          <div class="flex items-center gap-4 mb-4">
            <label for="temperature" class="font-semibold w-24">Т, °C</label>
            <InputText
              id="temperature"
              class="flex-auto w-full"
              v-model="programData.temperature"
            />
          </div>
          <div class="flex justify-between items-center gap-4 mb-4">
            <label class="font-semibold" for="isHeavySoiling">Сильного забруднення</label>
            <ToggleSwitch id="isHeavySoiling" v-model="programData.is_heavy_soiling" />
          </div>
        </div>
        <Divider layout="vertical" />
        <div>
          <p class="font-semibold">Норми</p>

          <div
            class="flex items-center gap-2 mt-3"
            v-for="(norm, index) in programData.norms"
            :key="index"
          >
            <Select
              v-model="norm.abstergent_id"
              variant="filled"
              :options="abstergentStore.abstergents"
              optionValue="id"
              optionLabel="name"
              placeholder="Оберіть засіб"
              class="w-full"
            />

            <label for="volum" class="font-semibold text-nowrap">Об'єм, Мл</label>
            <InputText id="volume" class="flex-auto w-16" v-model="norm.values[0].volume" />

            <div>
              <Button
                @click="removeNorm(index)"
                icon="pi pi-trash"
                severity="danger"
                rounded
              ></Button>
            </div>
          </div>

          <Button @click="addNorm()" class="mt-3" icon="pi pi-plus" rounded raised />
        </div>
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
        v-show="programsStore.updateValidationErrors.length > 0"
        severity="error"
      >
        Виникла помилка! Перевірте введені дані.
        <p
          class="font-normal"
          v-for="(error, index) in programsStore.updateValidationErrors"
          :key="index"
        >
          {{ index + 1 }}. {{ error }}
        </p>
      </Message>
    </Dialog>

    <Dialog
      v-model:visible="removeDialogVisible"
      modal
      header="Видалення програми"
      :style="{ 'min-width': '25rem' }"
      :closable="false"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        Ви дійсно бажаєте видалити програму?
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

    <Toast group="programs-errors" position="top-center"/>
  </div>
</template>
