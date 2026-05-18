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
  <div class="min-h-screen flex items-center justify-center p-4" style="background: linear-gradient(135deg, #f4f7f0 0%, #eef3e8 60%, #e0edd6 100%);">
    <div class="w-full max-w-md">
      <div class="bg-white shadow-xl rounded-2xl border p-8" style="border-color: #d4e0c8;">

        <!-- ENCABEZADO -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background: #eef3e8;">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" style="color: #5c8b32;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold" style="color: #0f0e0b;">Iniciar Sesión</h1>
          <p class="text-sm mt-2" style="color: #6b7c5e;">Accede al gestor de tarjetas</p>
        </div>

        <!-- ERROR -->
        <div v-if="authStore.error" class="mb-4 px-4 py-3 rounded-lg text-sm" style="background: #fdecea; border: 1px solid #f5c6c6; color: #c0392b;">
          {{ authStore.error }}
        </div>

        <!-- FORMULARIO -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium mb-2" style="color: #6b7c5e;">Correo Electrónico</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full rounded-xl px-4 py-3 outline-none transition"
              style="border: 1.5px solid #d4e0c8; background: #f9fbf7; color: #0f0e0b;"
              placeholder="Ingresa tu correo"
              @focus="$event.target.style.borderColor='#5c8b32'"
              @blur="$event.target.style.borderColor='#d4e0c8'"
            >
          </div>

          <div>
            <label class="block text-sm font-medium mb-2" style="color: #6b7c5e;">Contraseña</label>
            <input
              v-model="password"
              type="password"
              required
              class="w-full rounded-xl px-4 py-3 outline-none transition"
              style="border: 1.5px solid #d4e0c8; background: #f9fbf7; color: #0f0e0b;"
              placeholder="Ingresa tu contraseña"
              @focus="$event.target.style.borderColor='#5c8b32'"
              @blur="$event.target.style.borderColor='#d4e0c8'"
            >
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full text-white font-semibold py-3 rounded-xl transition flex justify-center items-center disabled:opacity-70"
            style="background: #5c8b32; box-shadow: 0 4px 14px rgba(92,139,50,0.25);"
            @mouseenter="$event.target.style.background='#184000'"
            @mouseleave="$event.target.style.background='#5c8b32'"
          >
            <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {{ authStore.loading ? 'Iniciando...' : 'Entrar' }}
          </button>
        </form>

        <!-- LINK REGISTRO -->
        <div class="mt-6 text-center">
          <router-link to="/registro" class="text-sm font-medium transition" style="color: #5c8b32;">
            Crear una cuenta
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>
