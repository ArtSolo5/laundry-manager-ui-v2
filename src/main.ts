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
import ConfirmationService from 'primevue/confirmationservice';

const app = createApp(App);

const customPreset = definePreset(Aura, {
  semantic: {
    primary: palette('#007aff'),
  },
});

app.use(createPinia());
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
});
app.use(ConfirmationService);

app.mount('#app');
