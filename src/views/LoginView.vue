<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (error) {
    console.error('Error en login:', error)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white shadow-xl rounded-2xl border border-slate-200 p-8">
        
        <!-- ENCABEZADO -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-800">Iniciar Sesión</h1>
          <p class="text-slate-500 text-sm mt-2">Accede al gestor de tarjetas</p>
        </div>

        <!-- ERROR -->
        <div v-if="authStore.error" class="mb-4 bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {{ authStore.error }}
        </div>

        <!-- FORMULARIO -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Correo Electrónico</label>
            <input 
              v-model="email" 
              type="email" 
              required 
              class="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition" 
              placeholder="Ingresa tu correo"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Contraseña</label>
            <input 
              v-model="password" 
              type="password" 
              required 
              class="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition" 
              placeholder="Ingresa tu contraseña"
            >
          </div>

          <button 
            type="submit" 
            :disabled="authStore.loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-blue-500/20 disabled:opacity-70 flex justify-center items-center"
          >
            <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ authStore.loading ? 'Iniciando...' : 'Entrar' }}
          </button>
        </form>

        <!-- LINK REGISTRO -->
        <div class="mt-6 text-center">
          <router-link to="/registro" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Crear una cuenta
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>
