import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/registro',
      name: 'registro',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue')
        },
        {
          path: 'compras',
          name: 'compras',
          component: () => import('@/views/PurchasesView.vue')
        },
        {
          path: 'tarjetas',
          name: 'tarjetas',
          component: () => import('@/views/CardsView.vue')
        },
        {
          path: 'proyecciones',
          name: 'proyecciones',
          component: () => import('@/views/ProjectionsView.vue')
        },
        {
          path: 'configuracion',
          name: 'configuracion',
          component: () => import('@/views/SettingsView.vue')
        }
      ]
    }
  ]
})

// Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Esperar a que Firebase resuelva el estado inicial de auth
  if (authStore.loading && authStore.user === null) {
    await authStore.initAuth()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const isAuthenticated = !!authStore.user

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (requiresGuest && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router

