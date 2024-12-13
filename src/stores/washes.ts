import { convertToSQLDate } from '@/helpers/date.helper';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { computed, ref, type Ref } from 'vue';
import { useWashDaysStore } from './wash-days';

const apiUrl = import.meta.env.VITE_API_URL;

export const useWashesStore = defineStore('washes', () => {
  const auth = useAuthStore();
  const washDays = useWashDaysStore();

  const washes: Ref<Wash[]> = ref([]);

  const createDialogVisible: Ref<boolean> = ref(false);
  const updateDialogVisible: Ref<boolean> = ref(false);

  const createValidationErrors: Ref<string[]> = ref([]);
  const updateValidationErrors: Ref<string[]> = ref([]);

  const loadWashes = async () => {
    const response = await fetch(`${apiUrl}/washes/date/${convertToSQLDate(washDays.date)}`, {
      headers: {
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

    if (response.status === 200) {
      washes.value = await response.json();
    }

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }
  };

  const createWash = async (payload: WashPaylod) => {
    const response = await fetch(`${apiUrl}/washes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
      body: JSON.stringify({
        program_id: Number(payload.program_id),
        day_id: Number(washDays.day?.id),
        weight: +payload.weight,
      }),
    });

    if (response.status === 201) {
      await loadWashes();
      createValidationErrors.value = [];
    }

    if (response.status === 400) {
      createValidationErrors.value = (await response.json()).message;
      throw new Error('Validation error');
    }

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }

    if (response.status === 403) throw new Error('Auth error');
  };

  const updateWash = async (payload: WashPaylod) => {
    const response = await fetch(`${apiUrl}/washes/${payload.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
      body: JSON.stringify({
        program_id: Number(payload.program_id),
        day_id: Number(washDays.day?.id),
        weight: +payload.weight,
      }),
    });

    if (response.status === 200) {
      await loadWashes();
      updateValidationErrors.value = [];
    }

    if (response.status === 400) {
      updateValidationErrors.value = (await response.json()).message;
      throw new Error('Validation error');
    }

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }

    if (response.status === 403) throw new Error('Auth error');
  };

  const removeWash = async (washId: number) => {
    const response = await fetch(`${apiUrl}/washes/${washId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

    if (response.status === 200) await loadWashes();

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }

    if (response.status === 403) throw new Error('Auth error');
  };

  const sumWeight = computed(() => {
    let s = 0;

    washes.value.forEach((a) => {
      s += +a.weight;
    });

    return String(s);
  });

  return {
    washes,
    loadWashes,
    updateDialogVisible,
    createDialogVisible,
    sumWeight,
    updateWash,
    createValidationErrors,
    updateValidationErrors,
    createWash,
    removeWash,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWashesStore, import.meta.hot));
}

interface Wash {
  id: number;
  code: number;
  name: string;
  program_id: number;
  temperature: string;
  weight: string;
  is_heavy_soiling: boolean;
}

export interface WashPaylod {
  id?: number;
  program_id: number | null;
  weight: string;
}
