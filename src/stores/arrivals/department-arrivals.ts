import { convertToSQLDate } from '@/helpers/date.helper';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useAuthStore } from '../auth';
import { computed, ref, watch, type Ref } from 'vue';

const apiUrl = import.meta.env.VITE_API_URL;

export const useDepArrivalsStore = defineStore('department-arrivals', () => {
  const auth = useAuthStore();

  const date: Ref<Date> = ref(new Date());
  const arrivals: Ref<Arrival[]> = ref([]);

  const createDialogArrival: Ref<boolean> = ref(false);
  const updateDialogVisible: Ref<boolean> = ref(false);
  const selectedArrival: Ref<Arrival | null> = ref(null);

  const createErrors: Ref<string[]> = ref([]);
  const updateErrors: Ref<string[]> = ref([]);

  const loadArrivals = async () => {
    const response = await fetch(`${apiUrl}/arrivals/date/${convertToSQLDate(date.value)}`, {
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

  const createArrival = async (payload: NewArrival) => {
    const response = await fetch(`${apiUrl}/arrivals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 201) {
      await loadArrivals();
      createDialogArrival.value = false;
    }

    if (response.status === 400) {
      createErrors.value = (await response.json()).message;
    }

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }

    if (response.status === 403) {
      createErrors.value = ['Відсутні дозволи на виконання операції'];
    }
  };

  const updateArrival = async () => {
    if (!selectedArrival.value) return;

    const response = await fetch(`${apiUrl}/arrivals/${selectedArrival.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
      body: JSON.stringify({
        day_id: +selectedArrival.value.day_id,
        department_id: +selectedArrival.value.department_id,
        weight: +selectedArrival.value.weight,
      }),
    });

    if (response.status === 200) {
      await loadArrivals();
      updateDialogVisible.value = false;
    }

    if (response.status === 400) {
      updateErrors.value = (await response.json()).message;
    }

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }

    if (response.status === 403) {
      updateErrors.value = ['Відсутні дозволи на виконання операції'];
    }
  };

  const openUpdateDialog = (id: number | null = null) => {
    const arrival = arrivals.value.find((a) => a.id === id);

    if (arrival) selectedArrival.value = arrival;

    updateDialogVisible.value = true;
  };

  const sumWeight = computed(() => {
    let s = 0;

    arrivals.value.forEach((a) => {
      s += Number(a.weight);
    });

    return s;
  });

  const percentage = computed(() => {
    let s = 0;

    arrivals.value.forEach((a) => {
      s += a.perc;
    });

    return s > 0 ? 100 : 0;
  });

  watch(date, async () => {
    await loadArrivals();
  });

  return {
    date,
    arrivals,
    loadArrivals,
    openUpdateDialog,
    updateDialogVisible,
    selectedArrival,
    sumWeight,
    percentage,
    updateArrival,
    createErrors,
    updateErrors
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
  weight: number;
}

interface NewArrival {
  day_id: number;
  department_id: number;
  weight: number;
}
