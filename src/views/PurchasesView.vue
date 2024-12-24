<script setup lang="ts">
import { DataTable, Column, Button, InputText, Select } from 'primevue';
import jsonData from '../../../purchases-parser/result.json';
import { ref } from 'vue';

const data = jsonData;

const departments = Array.from(new Set(data.map(i => i.department)));

const filters = ref({
  subject: {
    value: '',
    matchMode: 'contains'
  },
  department: {
    value: '',
    matchMode: 'equals'
  }
});
</script>

<template>
  <section class="overflow-hidden">
    <DataTable
      :value="data"
      style="min-height: calc(100vh - 80px);"
      scrollHeight="calc(100vh - 190px)"
      v-model:filters="filters"
      filterDisplay="row"
      selectionMode="single"
      size="small"
      showGridlines
      scrollable
      paginator
      :rows="10"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold">Закупівлі</span>
          <Button icon="pi pi-plus" rounded raised />
        </div>
      </template>
      <Column field="number" sortable header="№" />
      <Column field="plan_number" header="№ плану закупівель" />
      <Column field="subject" header="Предмет закупівлі">
        <template #body="{ data }">
          <span class="line-clamp-2">{{ data.subject }}</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Пошук..." />
        </template>
      </Column>
      <Column field="description" header="Деталізація" />
      <Column field="procedure" header="Процедура" />
      <Column field="fin_plan" header="Стаття фін.плану" />
      <Column field="department" header="Підрозділ">
        <template #filter="{ filterModel, filterCallback }">
            <Select v-model="filterModel.value" @update:modelValue="filterCallback()" :options="departments" placeholder="Підрозділ..." fluid />
        </template>
      </Column>
      <Column field="priority" header="Пріорітет" />
      <Column field="receive_date" header="Отримання заявки" />
      <Column field="responsible_person" header="Відповідальний від ВМТЗ/ВЕР" />
      <Column field="receive_customer_date" header="Надання для затвердження замовнику" />
      <Column field="receive_approval_date" header="Отримання затвердженої заявки" />
      <Column field="authorized_person" header="УО" />
      <Column field="announcement_date" header="Оприлюднення оголошення закупівлі" />
      <Column field="auction_date" header="Аукціон" />
      <Column field="stage" header="Стадія (результат) закупівлі" />
      <Column field="contract_date" header="Дата договору" />
      <Column field="contract_number" header="№ Договору" />
      <Column field="contract_conlusion_responsible" header="Відповідальний за укладання договору" />
      <Column field="contract_execution_responsible" header="Відповідальний за виконання договору" />
      <Column field="contract_price" header="Сума укладеного договору" />
      <Column field="expected_contact_price" header="Очікуванна вартість" />
      <Column field="contract_delivery_date" header="Термін поставки/виконання (за договором)" />
      <Column field="actual_delivery_date" header="Термін поставки/виконання робіт ФАКТ" />
      <Column field="code_dk" header="Код ДК" />
      <Column field="contract_boards_agreement" header="Погодження з ГРзК та ЛРзК" />
      <Column field="notes" header="Примітки" />
    </DataTable>
  </section>
</template>