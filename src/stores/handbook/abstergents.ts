import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { useAuthStore } from '../auth';

const apiUrl = import.meta.env.VITE_API_URL;

export const useAbstergentsStore = defineStore('abstergents', () => {
  const auth = useAuthStore();

  const abstergents: Ref<Abstergent[]> = ref([]);

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

  return { abstergents, loadAbstergents };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAbstergentsStore, import.meta.hot));
}

export interface Abstergent {
  id: number;
  name: string;
}
