import './assets/main.css';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { definePreset } from '@primevue/themes';
import { palette } from '@primevue/themes';
import { uk } from 'primelocale/uk.json';
import { useAuthStore } from './stores/auth';
import ToastService from 'primevue/toastservice';

const app = createApp(App);

const customPreset = definePreset(Aura, {
  semantic: {
    primary: palette('#007aff'),
  },
});

app.use(createPinia());

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (!authStore.isAuth() && to.path !== '/login') return '/login';
});

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: customPreset,
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities',
      },
    },
  },
  locale: uk,
  components: {
    menubar: {
      background: '{surface.700}',
    },
  },
});
app.use(ToastService);

app.mount('#app');
