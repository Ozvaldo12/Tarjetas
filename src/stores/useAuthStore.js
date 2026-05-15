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
      onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser
        loading.value = false
        resolve(currentUser)
      })
    })
  }

  const login = async (email, password) => {
    error.value = null
    try {
      loading.value = true
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      return userCredential.user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (email, password) => {
    error.value = null
    try {
      loading.value = true
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      return userCredential.user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    error.value = null
    try {
      loading.value = true
      await signOut(auth)
      user.value = null
    } catch (err) {
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
