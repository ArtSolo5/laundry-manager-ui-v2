import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { useAuthStore } from '../auth';
import type { Abstergent } from './abstergents';
import type { Uniform } from './uniforms';
import { useToastStore } from '../toast';

const apiUrl = import.meta.env.VITE_API_URL;

export const useProgramsStore = defineStore('programs', () => {
  const TOAST_GROUP = 'programs-errors';

  const auth = useAuthStore();
  const toastStore = useToastStore();

  const programs: Ref<Program[]> = ref([]);

  const createValidationErrors: Ref<string[]> = ref([]);
  const updateValidationErrors: Ref<string[]> = ref([]);

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

  const createProgram = async (payload: Program) => {
    const response = await fetch(`${apiUrl}/programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
      body: JSON.stringify({
        code: +payload.code,
        uniform_id: payload.uniform_id ? +payload.uniform_id : null,
        temperature: +payload.temperature,
        is_heavy_soiling: payload.is_heavy_soiling,
        norms: payload.norms,
      }),
    });

    if (response.status === 201) {
      await loadPrograms();
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

  const updateProgram = async (payload: Program) => {
    const response = await fetch(`${apiUrl}/programs/${payload.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
      body: JSON.stringify({
        uniform_id: payload.uniform_id ? +payload.uniform_id : null,
        code: +payload.code,
        temperature: +payload.temperature,
        is_heavy_soiling: payload.is_heavy_soiling,
        norms: payload.norms,
      }),
    });

    if (response.status === 200) {
      await loadPrograms();
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

  const removeProgram = async (programId: number) => {
    const response = await fetch(`${apiUrl}/programs/${programId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

    if (response.status === 200) {
      await loadPrograms();
    } else if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    } else if (response.status === 403) {
      toastStore.showForbiddenToast(TOAST_GROUP);
    } else {
      toastStore.showServerErrorToast(TOAST_GROUP);
    }
  };

  return {
    programs,
    loadPrograms,
    createProgram,
    updateProgram,
    removeProgram,
    createValidationErrors,
    updateValidationErrors,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProgramsStore, import.meta.hot));
}

export interface Program {
  id?: number;
  name?: string;
  uniform_id?: number | null;
  code: string;
  temperature: string;
  is_heavy_soiling: boolean;
  uniform?: Uniform;
  norms: Norm[];
}

interface Norm {
  id?: number;
  abstergent_id: number | null;
  abstergent?: Abstergent;
  values: NormValue[];
}

interface NormValue {
  id?: number;
  volume: string;
}
