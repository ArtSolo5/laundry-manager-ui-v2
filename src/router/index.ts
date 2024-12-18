import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import LoginView from '@/views/LoginView.vue';
import ArrivalsView from '@/views/ArrivalsView.vue';
import WashesView from '@/views/WashesView.vue';
import ReportView from '@/views/ReportView.vue';
import HandbookView from '@/views/HandbookView.vue';
import { useAuthStore } from '@/stores/auth';
import permissions from '@/permissions/sidebar';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/arrivals',
      name: 'arrivals',
      component: ArrivalsView,
      beforeEnter: () => {
        const authStore = useAuthStore();
        return authStore.isAllowed(permissions.arrivals);
      },
    },
    {
      path: '/washes',
      name: 'washes',
      component: WashesView,
      beforeEnter: () => {
        const authStore = useAuthStore();
        if (!authStore.isAllowed(permissions.washes)) window.location.replace('/');
      },
    },
    {
      path: '/report',
      name: 'report',
      component: ReportView,
      beforeEnter: () => {
        const authStore = useAuthStore();
        if (!authStore.isAllowed(permissions.reports)) window.location.replace('/');
      },
    },
    {
      path: '/handbook',
      name: 'handbook',
      component: HandbookView,
      beforeEnter: () => {
        const authStore = useAuthStore();
        if (!authStore.isAllowed(permissions.handbook)) window.location.replace('/');
      },
    },
  ],
});

export default router;
