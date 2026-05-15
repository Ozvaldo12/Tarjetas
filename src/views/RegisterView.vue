<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const localError = ref(null)

const router = useRouter()
const authStore = useAuthStore()

const handleRegister = async () => {
  localError.value = null
  
  if (password.value !== confirmPassword.value) {
    localError.value = 'Las contraseñas no coinciden.'
    return
  }

  try {
    await authStore.register(email.value, password.value)
    router.push('/')
  } catch (error) {
    console.error('Error en registro:', error)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white shadow-xl rounded-2xl border border-slate-200 p-8">

        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v6m3-3h-6M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2h-3.172a2 2 0 01-1.414-.586l-.828-.828A2 2 0 0012.172 4H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-800">Crear Cuenta</h1>
          <p class="text-slate-500 text-sm mt-2">Registra un nuevo usuario</p>
        </div>

        <div v-if="localError || authStore.error" class="mb-4 bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {{ localError || authStore.error }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Correo Electrónico</label>
            <input 
              v-model="email" 
              type="email" 
              required 
              class="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition" 
              placeholder="tu@correo.com"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Contraseña</label>
            <input 
              v-model="password" 
              type="password" 
              required 
              class="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition" 
              placeholder="Contraseña"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-600 mb-2">Confirmar contraseña</label>
            <input 
              v-model="confirmPassword" 
              type="password" 
              required 
              class="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition" 
              placeholder="Repite la contraseña"
            >
          </div>

          <button 
            type="submit" 
            :disabled="authStore.loading"
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 disabled:opacity-70 flex justify-center items-center"
          >
            <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ authStore.loading ? 'Registrando...' : 'Registrarse' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <router-link to="/login" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
            ¿Ya tienes cuenta? Inicia sesión
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>
