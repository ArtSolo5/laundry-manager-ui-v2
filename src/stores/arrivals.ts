import { convertToSQLDate } from '@/helpers/date.helper';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { ref, watch, type Ref } from 'vue';

const apiUrl = import.meta.env.VITE_API_URL;

export const useArrivalsStore = defineStore('arrivals', () => {
  const auth = useAuthStore();

  const date: Ref<Date> = ref(new Date());
  const depArrivals: Ref<DepArrivals[]> = ref([]);
  const absArrivals: Ref<AbsArrivals[]> = ref([]);

  const loadDepArrivals = async () => {
    const response = await fetch(`${apiUrl}/arrivals/date/${convertToSQLDate(date.value)}`, {
      headers: {
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

    if (response.status === 200) {
      depArrivals.value = await response.json();
    }

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }
  };

  watch(date, async () => {
    await loadDepArrivals();
  });

  return { date, depArrivals, absArrivals, loadDepArrivals };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useArrivalsStore, import.meta.hot));
}

interface DepArrivals {
  id: number;
  name: string;
  day_id: number;
  department_id: number;
  perc: number;
  weight: number;
}

interface AbsArrivals {
  id: number;
  abstergent_id: number;
  day_id: number;
  volume: number;
  created_at: string;
  updated_at: string;
  abstergent: Abstergent;
}

interface Abstergent {
  id: number;
  name: string;
}
