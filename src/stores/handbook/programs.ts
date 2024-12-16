import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { useAuthStore } from '../auth';
import type { Abstergent } from './abstergents';

const apiUrl = import.meta.env.VITE_API_URL;

export const useProgramsStore = defineStore('programs', () => {
  const auth = useAuthStore();

  const programs: Ref<Program[]> = ref([]);

  const loadPrograms = async () => {
    const response = await fetch(`${apiUrl}/programs`, {
      headers: {
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

    if (response.status === 200) {
        programs.value = await response.json();
    }

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }
  };

  return { programs, loadPrograms };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProgramsStore, import.meta.hot));
}

export interface Program {
  id: number;
  name: string;
  uniform_id: number;
  code: number;
  temperature: number;
  is_heavy_soiling: boolean;
  uniform: Uniform;
  norms: Norm[];
}

interface Uniform {
  id: number;
  name: string;
}

interface Norm {
  id: number;
  abtergent_id: number;
  abstergent: Abstergent;
  value: NormValue;
}

interface NormValue {
  id: number;
  volume: number;
}
