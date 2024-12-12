import { convertToSQLDate } from '@/helpers/date.helper';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useAuthStore } from '../auth';
import { computed, ref, type Ref } from 'vue';
import { useWashDaysStore } from '../wash-days';

const apiUrl = import.meta.env.VITE_API_URL;

export const useDepArrivalsStore = defineStore('department-arrivals', () => {
  const auth = useAuthStore();
  const washDays = useWashDaysStore();

  const arrivals: Ref<Arrival[]> = ref([]);

  const createDialogVisible: Ref<boolean> = ref(false);
  const updateDialogVisible: Ref<boolean> = ref(false);

  const createValidationErrors: Ref<string[]> = ref([]);
  const updateValidationErrors: Ref<string[]> = ref([]);

  const loadArrivals = async () => {
    const response = await fetch(`${apiUrl}/arrivals/date/${convertToSQLDate(washDays.date)}`, {
      headers: {
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

    if (response.status === 200) {
      arrivals.value = await response.json();
    }

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }
  };

  const createArrival = async (payload: DepArrival) => {
    const response = await fetch(`${apiUrl}/arrivals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
      body: JSON.stringify({
        department_id: Number(payload.department_id),
        day_id: Number(washDays.day?.id),
        weight: +payload.weight,
      }),
    });

    if (response.status === 201) {
      await loadArrivals();
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

  const updateArrival = async (payload: DepArrival) => {
    const response = await fetch(`${apiUrl}/arrivals/${payload.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
      body: JSON.stringify({
        department_id: Number(payload.department_id),
        day_id: Number(washDays.day?.id),
        weight: +payload.weight,
      }),
    });

    if (response.status === 200) {
      await loadArrivals();
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

  const sumWeight = computed(() => {
    let s = 0;

    arrivals.value.forEach((a) => {
      s += +a.weight;
    });

    return String(s);
  });

  const percentage = computed(() => {
    let s = 0;

    arrivals.value.forEach((a) => {
      s += a.perc;
    });

    return String(s > 0 ? 100 : 0);
  });

  return {
    arrivals,
    loadArrivals,
    updateDialogVisible,
    createDialogVisible,
    sumWeight,
    percentage,
    updateArrival,
    createValidationErrors,
    updateValidationErrors,
    createArrival,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDepArrivalsStore, import.meta.hot));
}

interface Arrival {
  id: number;
  name: string;
  day_id: number;
  department_id: number;
  perc: number;
  weight: string;
}

export interface DepArrival {
  id?: number;
  department_id: number | null;
  weight: string;
}
