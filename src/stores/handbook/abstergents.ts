import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { useAuthStore } from '../auth';
import { useToastStore } from '../toast';

const apiUrl = import.meta.env.VITE_API_URL;

export const useAbstergentsStore = defineStore('abstergents', () => {
  const TOAST_GROUP = 'abstergents-errors';

  const auth = useAuthStore();
  const toastStore = useToastStore();

  const abstergents: Ref<Abstergent[]> = ref([]);

  const createValidationErrors: Ref<string[]> = ref([]);
  const updateValidationErrors: Ref<string[]> = ref([]);

  const loadAbstergents = async () => {
    const response = await fetch(`${apiUrl}/abstergents`, {
      headers: {
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

    if (response.status === 200) {
      abstergents.value = await response.json();
    }

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }
  };

  const createAbstergent = async (payload: Abstergent) => {
    const response = await fetch(`${apiUrl}/abstergents`, {
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
      await loadAbstergents();
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

  const updateAbstergent = async (payload: Abstergent) => {
    const response = await fetch(`${apiUrl}/abstergents/${payload.id}`, {
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
      await loadAbstergents();
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

  const removeAbstergent = async (absId: number) => {
    const response = await fetch(`${apiUrl}/abstergents/${absId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

    if (response.status === 200) {
      await loadAbstergents();
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
    abstergents,
    loadAbstergents,
    createAbstergent,
    updateAbstergent,
    removeAbstergent,
    createValidationErrors,
    updateValidationErrors,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAbstergentsStore, import.meta.hot));
}

export interface Abstergent {
  id?: number;
  name: string;
}
