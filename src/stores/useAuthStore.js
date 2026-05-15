import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '@/services/firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  // Observador de estado de sesión
  const initAuth = () => {
    return new Promise((resolve) => {
      console.log('[initAuth] Verificando estado inicial de sesión...')
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          console.log(`[onAuthStateChanged] Usuario logueado: ${currentUser.uid}`)
        } else {
          console.log('[onAuthStateChanged] No hay usuario logueado.')
        }
        user.value = currentUser
        loading.value = false
        resolve(currentUser)
      })
    })
  }

  const login = async (email, password) => {
    error.value = null
    console.log(`[login] Intentando loguear: ${email}`)
    try {
      loading.value = true
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      console.log(`[login] Éxito. UID: ${userCredential.user.uid}`)
      return userCredential.user
    } catch (err) {
      console.error('[login] Error:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (email, password) => {
    error.value = null
    console.log(`[register] Intentando registrar: ${email}`)
    try {
      loading.value = true
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      console.log(`[register] Éxito. UID: ${userCredential.user.uid}`)
      return userCredential.user
    } catch (err) {
      console.error('[register] Error:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    error.value = null
    console.log('[logout] Cerrando sesión...')
    try {
      loading.value = true
      await signOut(auth)
      user.value = null
      console.log('[logout] Sesión cerrada.')
    } catch (err) {
      console.error('[logout] Error:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    initAuth,
    login,
    register,
    logout
  }
})
