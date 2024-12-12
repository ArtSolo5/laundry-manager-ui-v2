import { convertToSQLDate } from '@/helpers/date.helper';
import { defineStore } from 'pinia';
import { ref, watch, type Ref } from 'vue';
import { useAuthStore } from './auth';
import { useDepArrivalsStore } from './arrivals/department-arrivals';

const apiUrl = import.meta.env.VITE_API_URL;

export const useWashDaysStore = defineStore('wash-days', () => {
  const auth = useAuthStore();
  const depArrivals = useDepArrivalsStore();

  const day: Ref<WashDay | null> = ref(null);
  const date: Ref<Date> = ref(new Date());

  const loadWashDay = async () => {
    const response = await fetch(`${apiUrl}/wash-days/date/${convertToSQLDate(date.value)}`, {
      headers: {
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

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
  });

  return { day, date, loadWashDay };
});

interface WashDay {
  id: number;
  date: Date;
}
