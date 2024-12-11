import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import LoginView from '@/views/LoginView.vue';
import ArrivalsView from '@/views/ArrivalsView.vue';
import WashesView from '@/views/WashesView.vue';
import ReportView from '@/views/ReportView.vue';
import HandbookView from '@/views/HandbookView.vue';

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
    },
    {
      path: '/washes',
      name: 'washes',
      component: WashesView,
    },
    {
      path: '/report',
      name: 'report',
      component: ReportView,
    },
    {
      path: '/handbook',
      name: 'handbook',
      component: HandbookView,
    },
  ],
});

export default router;
