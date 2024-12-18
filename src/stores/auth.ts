import { jwtDecode } from 'jwt-decode';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useToast } from 'primevue';
import { ref, type Ref } from 'vue';
import { useToastStore } from './toast';

const apiUrl = import.meta.env.VITE_API_URL;

export const useAuthStore = defineStore('auth', () => {
  const toast = useToast();

  const toastStore = useToastStore();

  const user: Ref<User | null> = ref(null);

  const login = async (data: LoginPayload) => {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: data.username.trim(),
        password: data.password.trim(),
      }),
    });

    if (response.status === 201) {
      const token = (await response.json()).access_token;

      document.cookie = `access_token=${token}`;

      if (data.rememberMe) {
        localStorage.setItem(
          'credentials',
          JSON.stringify({ username: data.username.trim(), password: data.password.trim() }),
        );
      } else {
        localStorage.removeItem('credentials');
      }

      window.location.replace('/');
    } else if (response.status === 401) {
      toast.add({
        severity: 'error',
        summary: 'Помилка авторизацїї!',
        detail: 'Перевірте дані для входу.',
        life: 3000,
        group: 'login-errors',
      });
    } else {
      toastStore.showServerErrorToast('login-errors');
    }
  };

  const logout = () => {
    deleteCookie('access_token');
    return window.location.replace('/login');
  };

  const isAuth = () => {
    return !!user.value;
  };

  const isAllowed = (permissions: string[]) => {
    if (!permissions.length) return true;

    let isAllowed = false;

    permissions.forEach((p) => {
      if (user.value?.permissions.map((permission) => permission.name).includes(p)) {
        isAllowed = true;
      }
    });

    return isAllowed;
  };

  const loadUserFromToken = () => {
    if (user.value) return;

    const token = getCookie('access_token');

    if (token) {
      user.value = jwtDecode(token);
    }
  };

  const loadStoredCreds = () => {
    const storedCreds = localStorage.getItem('credentials');

    if (storedCreds) {
      return {
        username: JSON.parse(storedCreds).username,
        password: JSON.parse(storedCreds).password,
        rememberMe: true,
      };
    }

    return null;
  };

  const getCookie = (name: string) => {
    const matches = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'),
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=`;
  };

  return {
    user,
    login,
    logout,
    getCookie,
    deleteCookie,
    loadStoredCreds,
    loadUserFromToken,
    isAuth,
    isAllowed,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}

interface User {
  sub: number;
  username: string;
  permissions: Permission[];
}

interface Permission {
  id: number;
  name: string;
}

interface LoginPayload {
  username: string;
  password: string;
  rememberMe: boolean;
}
