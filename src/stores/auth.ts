import { jwtDecode } from 'jwt-decode';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

const apiUrl = import.meta.env.VITE_API_URL;

export const useAuthStore = defineStore('auth', () => {
  const user: Ref<User|null> = ref(null);
  const authError: Ref<boolean> = ref(false)

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

    if (response.status !== 201) return (authError.value = true);

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

    return window.location.replace('/');
  }

  const logout = () => {
    deleteCookie('access_token');
    return window.location.replace('/login');
  }

  const isAuth = () => {
    return !!user.value;
  }

  const loadUserFromToken = () => {
    if (user.value) return;

    const token = getCookie('access_token');

    if (token) {
      user.value = jwtDecode(token);
    }
  }

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
  }

  const getCookie = (name: string) => {
    const matches = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'),
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=`;
  }

  return { user, authError, login, logout, getCookie, deleteCookie, loadStoredCreds, loadUserFromToken, isAuth };
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
