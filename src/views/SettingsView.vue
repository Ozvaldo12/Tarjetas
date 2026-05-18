<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { useCardsStore } from '@/stores/useCardsStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const cardsStore = useCardsStore()
const router = useRouter()

const handleLogout = async () => {
  cardsStore.stopSync()
  await authStore.logout()
  router.push('/login')
}

const appVersion = '1.1.0'
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2" style="color: #0f0e0b;">
        <span class="text-2xl">⚙️</span> Configuración
      </h1>
      <p class="text-sm mt-1" style="color: #6b7c5e;">Ajustes de tu cuenta y la aplicación.</p>
    </div>

    <div class="space-y-6 max-w-2xl">
      <!-- Account -->
      <div class="bg-white border rounded-2xl p-6 shadow-sm" style="border-color: #d4e0c8;">
        <h2 class="text-base font-bold mb-4 flex items-center gap-2" style="color: #0f0e0b;">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" style="color: #5c8b32;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          Cuenta
        </h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between py-2 border-b border-slate-100">
            <span class="text-sm text-slate-500">Correo electrónico</span>
            <span class="text-sm font-semibold text-slate-800">{{ authStore.user?.email }}</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-slate-100">
            <span class="text-sm text-slate-500">UID</span>
            <span class="text-xs font-mono text-slate-400">{{ authStore.user?.uid }}</span>
          </div>
          <div class="flex items-center justify-between py-2">
            <span class="text-sm text-slate-500">Tarjetas registradas</span>
            <span class="text-sm font-semibold text-slate-800">{{ cardsStore.cards.length }}</span>
          </div>
        </div>
      </div>

      <!-- App Info -->
      <div class="bg-white border rounded-2xl p-6 shadow-sm" style="border-color: #d4e0c8;">
        <h2 class="text-base font-bold mb-4 flex items-center gap-2" style="color: #0f0e0b;">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" style="color: #5c8b32;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Aplicación
        </h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between py-2 border-b" style="border-color: #e6eedf;">
            <span class="text-sm" style="color: #6b7c5e;">Versión</span>
            <span class="text-sm font-semibold" style="color: #0f0e0b;">v{{ appVersion }}</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b" style="border-color: #e6eedf;">
            <span class="text-sm" style="color: #6b7c5e;">Stack</span>
            <span class="text-sm" style="color: #0f0e0b;">Vue 3 + Vite + Firebase</span>
          </div>
          <div class="flex items-center justify-between py-2">
            <span class="text-sm" style="color: #6b7c5e;">PWA</span>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full" style="color: #5c8b32; background: #eef3e8; border: 1px solid #c8ddb2;">Activa</span>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-white border border-red-200 rounded-2xl p-6 shadow-sm">
        <h2 class="text-base font-bold text-red-700 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
          Zona de Peligro
        </h2>
        <p class="text-sm text-slate-500 mb-4">Esta acción cerrará tu sesión actual.</p>
        <button @click="handleLogout" class="px-5 py-2.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors shadow-sm text-sm font-semibold">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </div>
</template>
