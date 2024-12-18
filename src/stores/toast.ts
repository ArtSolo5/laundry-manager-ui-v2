import { defineStore } from 'pinia';
import { useToast } from 'primevue';

export const useToastStore = defineStore('toast', () => {
  const toast = useToast();

  const showForbiddenToast = (group: string): void => {
    toast.add({
      severity: 'error',
      summary: 'Помилка операції!',
      detail: 'Недостатньо прав для виконання.',
      life: 3000,
      group,
    });
  };

  const showServerErrorToast = (group: string): void => {
    toast.add({
      severity: 'error',
      summary: 'Помилка операції!',
      detail: 'Сервер не може обробити запит.',
      life: 3000,
      group,
    });
  };

  return { showForbiddenToast, showServerErrorToast };
});
