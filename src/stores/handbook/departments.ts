import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { useAuthStore } from '../auth';

const apiUrl = import.meta.env.VITE_API_URL;

export const useDepartmentsStore = defineStore('departments', () => {
  const auth = useAuthStore();

  const departments: Ref<Department[]> = ref([]);

  const loadDepartments = async () => {
    const response = await fetch(`${apiUrl}/departments`, {
      headers: {
        Authorization: `Bearer ${auth.getCookie('access_token')}`,
      },
    });

    if (response.status === 200) {
      departments.value = await response.json();
    }

    if (response.status === 401) {
      auth.deleteCookie('access_token');
      window.location.replace('/login');
    }
  };

  return { departments, loadDepartments };
});

interface Department {
  id: number;
  name: string;
}
