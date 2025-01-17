import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ReportView from '@/views/ReportView.vue'
import RegistrationView from '@/views/RegistrationView.vue'
import DataView from '@/views/DataView.vue'
import UserManagementView from '@/views/UserManagementView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/reportar-producao',
      name: 'reportar-producao',
      component: ReportView,
    },
    {
      path: '/extracao-dados',
      name: 'extracao-dados',
      component: DataView,
    },
    {
      path: '/cadastro',
      name: 'cadastro',
      component: RegistrationView,
    },
    {
      path: '/gerenciar-usuarios',
      name: 'gerenciar-usuarios',
      component: UserManagementView,
    },
  ],
})

export default router
