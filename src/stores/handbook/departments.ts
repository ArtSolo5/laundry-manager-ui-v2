import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { useAuthStore } from '../auth';
import { useToastStore } from '../toast';

const apiUrl = import.meta.env.VITE_API_URL;

export const useDepartmentsStore = defineStore('departments', () => {
  const TOAST_GROUP = 'departments-errors';

  const auth = useAuthStore();
  const toastStore = useToastStore();

  const departments: Ref<Department[]> = ref([]);

  const createValidationErrors: Ref<string[]> = ref([]);
  const updateValidationErrors: Ref<string[]> = ref([]);

  const loadDepartments = async () => {
    const response = await fetch(`${apiUrl}/departments`, {
      headers: {
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

    if (response.status === 200) {
      departments.value = await response.json();
    }

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }
  };

  const createDepartment = async (payload: Department) => {
    const response = await fetch(`${apiUrl}/departments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
      body: JSON.stringify({
        name: payload.name,
      }),
    });

    if (response.status === 201) {
      await loadDepartments();
      createValidationErrors.value = [];
    } else if (response.status === 400) {
      createValidationErrors.value = (await response.json()).message;
      throw new Error('Validation error.');
    } else if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    } else if (response.status === 403) {
      toastStore.showForbiddenToast(TOAST_GROUP);
    } else {
      toastStore.showServerErrorToast(TOAST_GROUP);
    }
  };

  const updateDepartment = async (payload: Department) => {
    const response = await fetch(`${apiUrl}/departments/${payload.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
      body: JSON.stringify({
        name: payload.name,
      }),
    });

    if (response.status === 200) {
      await loadDepartments();
      updateValidationErrors.value = [];
    } else if (response.status === 400) {
      updateValidationErrors.value = (await response.json()).message;
      throw new Error('Validation error.');
    } else if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    } else if (response.status === 403) {
      toastStore.showForbiddenToast(TOAST_GROUP);
    } else {
      toastStore.showServerErrorToast(TOAST_GROUP);
    }
  };

  const removeDepartment = async (depId: number) => {
    const response = await fetch(`${apiUrl}/departments/${depId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

    if (response.status === 200) {
      await loadDepartments();
    } else if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    } else if (response.status === 403) {
      toastStore.showForbiddenToast(TOAST_GROUP);
    } else {
      toastStore.showServerErrorToast(TOAST_GROUP);
    }
  };

  return {
    departments,
    loadDepartments,
    createDepartment,
    updateDepartment,
    removeDepartment,
    createValidationErrors,
    updateValidationErrors,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDepartmentsStore, import.meta.hot));
}

export interface Department {
  id?: number;
  name: string;
}
