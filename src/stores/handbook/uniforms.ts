import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { useAuthStore } from '../auth';

const apiUrl = import.meta.env.VITE_API_URL;

export const useUniformsStore = defineStore('uniforms', () => {
  const auth = useAuthStore();

  const uniforms: Ref<Uniform[]> = ref([]);

  const createValidationErrors: Ref<string[]> = ref([]);
  const updateValidationErrors: Ref<string[]> = ref([]);

  const loadUniforms = async () => {
    const response = await fetch(`${apiUrl}/uniforms`, {
      headers: {
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

    if (response.status === 200) {
      uniforms.value = await response.json();
    }

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }
  };

  const createUniform = async (payload: Uniform) => {
    const response = await fetch(`${apiUrl}/uniforms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
      body: JSON.stringify({
        name: payload.name,
      }),
    });

    if (response.status === 201) {
      await loadUniforms();
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

  const updateUniform = async (payload: Uniform) => {
    const response = await fetch(`${apiUrl}/uniforms/${payload.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
      body: JSON.stringify({
        name: payload.name,
      }),
    });

    if (response.status === 200) {
      await loadUniforms();
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

  const removeUniform = async (depId: number) => {
    const response = await fetch(`${apiUrl}/uniforms/${depId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

    if (response.status === 200) await loadUniforms();

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }

    if (response.status === 403) throw new Error('Auth error');
  };

  return {
    uniforms,
    loadUniforms,
    createUniform,
    updateUniform,
    removeUniform,
    createValidationErrors,
    updateValidationErrors,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUniformsStore, import.meta.hot));
}

export interface Uniform {
  id?: number;
  name: string;
}
