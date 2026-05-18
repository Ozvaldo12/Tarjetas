<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCardsStore } from '@/stores/useCardsStore'
import { onMounted, onUnmounted } from 'vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const cardsStore = useCardsStore()

const sidebarCollapsed = ref(false)
const mobileMenuOpen = ref(false)

const navItems = [
  { name: 'Dashboard', path: '/', icon: 'dashboard' },
  { name: 'Compras', path: '/compras', icon: 'purchases' },
  { name: 'Tarjetas', path: '/tarjetas', icon: 'cards' },
  { name: 'Proyecciones', path: '/proyecciones', icon: 'projections' },
  { name: 'Configuración', path: '/configuracion', icon: 'settings' }
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  cardsStore.stopSync()
  await authStore.logout()
  router.push('/login')
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// Sync cards on mount so all child views have data
onMounted(() => {
  if (authStore.user) {
    cardsStore.fetchCards()
  }
})

onUnmounted(() => {
  cardsStore.stopSync()
})
</script>

<template>
  <div :class="['app-layout', sidebarCollapsed ? 'app-layout--collapsed' : '']">
    <!-- SIDEBAR (Desktop) -->
    <aside
      :class="[
        'sidebar',
        sidebarCollapsed ? 'sidebar--collapsed' : ''
      ]"
    >
      <!-- Logo -->
      <div class="sidebar__header">
        <div class="sidebar__logo">
          <span class="sidebar__logo-icon">💳</span>
          <Transition name="fade-text">
            <span v-if="!sidebarCollapsed" class="sidebar__logo-text">Tarjetas Pro</span>
          </Transition>
        </div>
        <button @click="toggleSidebar" class="sidebar__toggle" aria-label="Toggle sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      <!-- Nav Items -->
      <nav class="sidebar__nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'sidebar__link',
            isActive(item.path) ? 'sidebar__link--active' : ''
          ]"
          :title="item.name"
        >
          <!-- Dashboard -->
          <svg v-if="item.icon === 'dashboard'" xmlns="http://www.w3.org/2000/svg" class="sidebar__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z"/>
          </svg>
          <!-- Purchases -->
          <svg v-else-if="item.icon === 'purchases'" xmlns="http://www.w3.org/2000/svg" class="sidebar__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
          </svg>
          <!-- Cards -->
          <svg v-else-if="item.icon === 'cards'" xmlns="http://www.w3.org/2000/svg" class="sidebar__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
          </svg>
          <!-- Projections -->
          <svg v-else-if="item.icon === 'projections'" xmlns="http://www.w3.org/2000/svg" class="sidebar__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <!-- Settings -->
          <svg v-else-if="item.icon === 'settings'" xmlns="http://www.w3.org/2000/svg" class="sidebar__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>

          <Transition name="fade-text">
            <span v-if="!sidebarCollapsed" class="sidebar__label">{{ item.name }}</span>
          </Transition>
        </router-link>
      </nav>

      <!-- User -->
      <div class="sidebar__footer">
        <div class="sidebar__user">
          <div class="sidebar__avatar">
            {{ authStore.user?.email?.charAt(0).toUpperCase() }}
          </div>
          <Transition name="fade-text">
            <div v-if="!sidebarCollapsed" class="sidebar__user-info">
              <p class="sidebar__user-email">{{ authStore.user?.email }}</p>
              <button @click="handleLogout" class="sidebar__logout-btn">Cerrar Sesión</button>
            </div>
          </Transition>
        </div>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <!-- Top bar (mobile) -->
      <header class="topbar">
        <div class="topbar__left">
          <span class="topbar__logo-icon">💳</span>
          <span class="topbar__title">Tarjetas Pro</span>
        </div>
        <div class="topbar__right">
          <div class="topbar__avatar">
            {{ authStore.user?.email?.charAt(0).toUpperCase() }}
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="page-content">
        <router-view v-slot="{ Component }">
          <Transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </div>
    </main>

    <!-- BOTTOM NAV (Mobile) -->
    <nav class="bottom-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'bottom-nav__item',
          isActive(item.path) ? 'bottom-nav__item--active' : ''
        ]"
      >
        <!-- Dashboard -->
        <svg v-if="item.icon === 'dashboard'" xmlns="http://www.w3.org/2000/svg" class="bottom-nav__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z"/>
        </svg>
        <!-- Purchases -->
        <svg v-else-if="item.icon === 'purchases'" xmlns="http://www.w3.org/2000/svg" class="bottom-nav__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
        </svg>
        <!-- Cards -->
        <svg v-else-if="item.icon === 'cards'" xmlns="http://www.w3.org/2000/svg" class="bottom-nav__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
        </svg>
        <!-- Projections -->
        <svg v-else-if="item.icon === 'projections'" xmlns="http://www.w3.org/2000/svg" class="bottom-nav__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <!-- Settings -->
        <svg v-else-if="item.icon === 'settings'" xmlns="http://www.w3.org/2000/svg" class="bottom-nav__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>

        <span class="bottom-nav__label">{{ item.name }}</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
/* ===== LAYOUT ===== */
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-light-bg, #f8fafc);
}

/* ===== SIDEBAR (Desktop) ===== */
.sidebar {
  display: none;
  flex-direction: column;
  width: 260px;
  background: linear-gradient(180deg, #082901 0%, #184000 100%);
  color: #d6e8c4;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 40;
  overflow: hidden;
}

.sidebar--collapsed {
  width: 72px;
}

.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}

.sidebar__logo-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.sidebar__logo-text {
  font-weight: 800;
  font-size: 18px;
  color: #d6e8c4;
  white-space: nowrap;
  letter-spacing: -0.02em;
}

.sidebar__toggle {
  flex-shrink: 0;
  padding: 6px;
  border-radius: 8px;
  color: #8fbf45;
  transition: all 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
}
.sidebar__toggle:hover {
  background: rgba(143,191,69,0.15);
  color: #d6e8c4;
}

.sidebar__nav {
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  color: #a8c890;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
}
.sidebar__link:hover {
  background: rgba(143,191,69,0.12);
  color: #d6e8c4;
}
.sidebar__link--active {
  background: rgba(143,191,69,0.22);
  color: #8fbf45;
}
.sidebar__link--active .sidebar__icon {
  color: #8fbf45;
}

.sidebar__icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.sidebar__label {
  font-size: 14px;
  font-weight: 600;
}

.sidebar__footer {
  padding: 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}

.sidebar__avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #5c8b32, #8fbf45);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: #082901;
  flex-shrink: 0;
}

.sidebar__user-info {
  overflow: hidden;
  white-space: nowrap;
}

.sidebar__user-email {
  font-size: 12px;
  color: #a8c890;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.sidebar__logout-btn {
  font-size: 11px;
  color: #f87171;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-top: 2px;
  font-weight: 600;
}
.sidebar__logout-btn:hover {
  color: #fca5a5;
}

/* ===== MAIN CONTENT ===== */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

/* ===== TOP BAR (Mobile) ===== */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #d4e0c8;
  position: sticky;
  top: 0;
  z-index: 30;
}

.topbar__left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.topbar__logo-icon {
  font-size: 22px;
}

.topbar__title {
  font-size: 18px;
  font-weight: 800;
  color: #0f0e0b;
  letter-spacing: -0.02em;
}

.topbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.topbar__avatar {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #5c8b32, #8fbf45);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  color: #082901;
}

/* ===== PAGE CONTENT ===== */
.page-content {
  flex: 1;
  padding: 16px;
  padding-bottom: 80px; /* Space for bottom nav */
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

/* ===== BOTTOM NAV (Mobile) ===== */
.bottom-nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
  background: white;
  border-top: 1px solid #d4e0c8;
  padding: 6px 0;
  padding-bottom: max(6px, env(safe-area-inset-bottom));
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 12px;
  border-radius: 10px;
  color: #8fa082;
  text-decoration: none;
  transition: all 0.2s;
  min-width: 56px;
}
.bottom-nav__item:hover {
  color: #5c8b32;
}
.bottom-nav__item--active {
  color: #5c8b32;
}
.bottom-nav__item--active .bottom-nav__icon {
  color: #5c8b32;
}

.bottom-nav__icon {
  width: 22px;
  height: 22px;
}

.bottom-nav__label {
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
}

/* ===== TRANSITIONS ===== */
.fade-text-enter-active,
.fade-text-leave-active {
  transition: opacity 0.2s ease;
}
.fade-text-enter-from,
.fade-text-leave-to {
  opacity: 0;
}

.page-fade-enter-active {
  transition: opacity 0.15s ease-out;
}
.page-fade-leave-active {
  transition: opacity 0.1s ease-in;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

/* ===== RESPONSIVE ===== */
@media (min-width: 768px) {
  .sidebar {
    display: flex;
  }

  .topbar {
    display: none;
  }

  .bottom-nav {
    display: none;
  }

  .main-content {
    margin-left: 260px;
    transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .app-layout--collapsed .main-content {
    margin-left: 72px;
  }

  .page-content {
    padding: 24px 32px;
    padding-bottom: 32px;
  }
}
</style>
