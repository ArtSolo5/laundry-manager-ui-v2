import { convertToSQLDate, toKievTimeZone } from '@/helpers/date.helper';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useAuthStore } from '../auth';
import { computed, ref, type Ref } from 'vue';
import { useWashDaysStore } from '../wash-days';
import type { Abstergent } from '../handbook/abstergents';
import { useToastStore } from '../toast';

const apiUrl = import.meta.env.VITE_API_URL;

export const useAbsArrivalsStore = defineStore('abstergent-arrivals', () => {
  const TOAST_GROUP = 'abstergent-arrivals-errors';

  const auth = useAuthStore();
  const washDays = useWashDaysStore();
  const toastStore = useToastStore();

  const arrivals: Ref<Arrival[]> = ref([]);

  const createDialogVisible: Ref<boolean> = ref(false);
  const updateDialogVisible: Ref<boolean> = ref(false);

  const createValidationErrors: Ref<string[]> = ref([]);
  const updateValidationErrors: Ref<string[]> = ref([]);

  const loadArrivals = async () => {
    const response = await fetch(
      `${apiUrl}/abstergent-arrivals/date/${convertToSQLDate(toKievTimeZone(washDays.date))}`,
      {
        headers: {
          Authorization: `Bearer ${auth.getCookie('access_token')}`,
        },
      },
    );

    if (response.status === 200) {
      arrivals.value = await response.json();
    }

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }
  };

  const createArrival = async (payload: AbsArrival) => {
    const response = await fetch(`${apiUrl}/abstergent-arrivals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
      body: JSON.stringify({
        abstergent_id: Number(payload.abstergent_id),
        day_id: Number(washDays.day?.id),
        volume: +payload.volume,
      }),
    });

    if (response.status === 201) {
      await loadArrivals();
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

  const updateArrival = async (payload: AbsArrival) => {
    const response = await fetch(`${apiUrl}/abstergent-arrivals/${payload.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
      body: JSON.stringify({
        abstergent_id: Number(payload.abstergent_id),
        day_id: Number(washDays.day?.id),
        volume: +payload.volume,
      }),
    });

    if (response.status === 200) {
      await loadArrivals();
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

  const removeArrival = async (arrId: number) => {
    const response = await fetch(`${apiUrl}/abstergent-arrivals/${arrId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

    if (response.status === 200) {
      await loadArrivals();
    } else if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    } else if (response.status === 403) {
      toastStore.showForbiddenToast(TOAST_GROUP);
    } else {
      toastStore.showServerErrorToast(TOAST_GROUP);
    }
  };

  const sumVolume = computed(() => {
    let s = 0;

    arrivals.value.forEach((a) => {
      s += +a.volume;
    });

    return String(s);
  });

  return {
    arrivals,
    loadArrivals,
    updateDialogVisible,
    createDialogVisible,
    sumVolume,
    updateArrival,
    createValidationErrors,
    updateValidationErrors,
    createArrival,
    removeArrival,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAbsArrivalsStore, import.meta.hot));
}

interface Arrival {
  id: number;
  name: string;
  day_id: number;
  abstergent_id: number;
  volume: string;
  abstergent: Abstergent;
}

export interface AbsArrival {
  id?: number;
  abstergent_id: number | null;
  volume: string;
}
