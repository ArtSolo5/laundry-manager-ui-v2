import { convertToSQLDate, toKievTimeZone } from '@/helpers/date.helper';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { computed, ref, type Ref } from 'vue';
import { useWashDaysStore } from './wash-days';
import { useToastStore } from './toast';

const apiUrl = import.meta.env.VITE_API_URL;

export const useWashesStore = defineStore('washes', () => {
  const TOAST_GROUP = 'washes-errors';

  const auth = useAuthStore();
  const washDays = useWashDaysStore();
  const toastStore = useToastStore();

  const washes: Ref<Wash[]> = ref([]);

  const createDialogVisible: Ref<boolean> = ref(false);
  const updateDialogVisible: Ref<boolean> = ref(false);

  const createValidationErrors: Ref<string[]> = ref([]);
  const updateValidationErrors: Ref<string[]> = ref([]);

  const loadWashes = async () => {
    const response = await fetch(
      `${apiUrl}/washes/date/${convertToSQLDate(toKievTimeZone(washDays.date))}`,
      {
        headers: {
          Authorization: `Bearer ${auth.getCookie('access_token')}`,
        },
      },
    );

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
      await washDays.loadWashDay();
      await loadWashes();
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
      await washDays.loadWashDay();
      await loadWashes();
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

  const removeWash = async (washId: number) => {
    const response = await fetch(`${apiUrl}/washes/${washId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

    if (response.status === 200) {
      await washDays.loadWashDay();
      await loadWashes();
    } else if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    } else if (response.status === 403) {
      toastStore.showForbiddenToast(TOAST_GROUP);
    } else {
      toastStore.showServerErrorToast(TOAST_GROUP);
    }
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
