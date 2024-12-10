import { jwtDecode } from 'jwt-decode';
import { acceptHMRUpdate, defineStore } from 'pinia';

const apiUrl = import.meta.env.VITE_API_URL;

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: null as User | null,
      authError: false,
    };
  },

  actions: {
    async login(data: LoginPayload) {
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

      if (response.status !== 201) return (this.authError = true);

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
    },

    isAuth() {
      return !!this.user;
    },

    loadUserFromToken() {
      if (this.user) return;

      const token = this.getCookie('access_token');

      if (token) {
        this.user = jwtDecode(token);
      }
    },

    getCookie(name: string) {
      const matches = document.cookie.match(
        new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'),
      );
      return matches ? decodeURIComponent(matches[1]) : undefined;
    },
  },
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
