import { convertToSQLDate, toKievTimeZone } from '@/helpers/date.helper';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, watch, type Ref } from 'vue';
import { useAuthStore } from './auth';
import { useDepArrivalsStore } from './arrivals/department-arrivals';
import { useAbsArrivalsStore } from './arrivals/abstergent-arrivals';
import { useWashesStore } from './washes';

const apiUrl = import.meta.env.VITE_API_URL;

export const useWashDaysStore = defineStore('wash-days', () => {
  const auth = useAuthStore();
  const depArrivals = useDepArrivalsStore();
  const absArrivals = useAbsArrivalsStore();
  const washes = useWashesStore();

  const day: Ref<WashDay | null> = ref(null);
  const date: Ref<Date> = ref(new Date());

  const loadWashDay = async () => {
    const response = await fetch(
      `${apiUrl}/wash-days/date/${convertToSQLDate(toKievTimeZone(date.value))}`,
      {
        headers: {
          Authorization: `Bearer ${auth.getCookie('access_token')}`,
        },
      },
    );

    if (response.status === 200) {
      day.value = await response.json();
    }

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }
  };

  watch(date, async () => {
    await loadWashDay();
    await depArrivals.loadArrivals();
    await absArrivals.loadArrivals();
    await washes.loadWashes();
  });

  return { day, date, loadWashDay };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWashDaysStore, import.meta.hot));
}

interface WashDay {
  id: number;
  date: Date;
}
