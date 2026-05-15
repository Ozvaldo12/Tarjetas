import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '@/services/firebase'
import { useAuthStore } from './useAuthStore'
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  deleteDoc, 
  query 
} from 'firebase/firestore'
import { useCalculations } from '@/composables/useCalculations'

export const useCardsStore = defineStore('cards', () => {
  const cards = ref([])
  const loading = ref(false)
  const authStore = useAuthStore()
  const { calculateCardCycles } = useCalculations()

  let unsubscribe = null

  // Sincronizar con Firestore en tiempo real
  const fetchCards = () => {
    if (!authStore.user) return

    loading.value = true
    const q = query(collection(db, `usuarios/${authStore.user.uid}/cards`))
    
    unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cardsData = []
      querySnapshot.forEach((doc) => {
        cardsData.push({ id: doc.id, ...doc.data() })
      })
      // Ordenar por campo 'order' o creación
      cards.value = cardsData.sort((a, b) => (a.order || 0) - (b.order || 0))
      loading.value = false
    })
  }

  const stopSync = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  // Operaciones de Firebase
  const addCard = async (cardData) => {
    if (!authStore.user) return
    const id = crypto.randomUUID()
    const docRef = doc(db, `usuarios/${authStore.user.uid}/cards`, id)
    await setDoc(docRef, { ...cardData, order: cards.value.length })
  }

  const updateCard = async (id, cardData) => {
    if (!authStore.user) return
    const docRef = doc(db, `usuarios/${authStore.user.uid}/cards`, id)
    await setDoc(docRef, cardData, { merge: true })
  }

  const deleteCard = async (id) => {
    if (!authStore.user) return
    const docRef = doc(db, `usuarios/${authStore.user.uid}/cards`, id)
    await deleteDoc(docRef)
  }

  const reorderCards = async (newOrderCards) => {
    if (!authStore.user) return
    // Actualiza el orden de todas en base a un array reordenado
    const batch = newOrderCards.map((c, i) => updateCard(c.id, { order: i }))
    await Promise.all(batch)
  }

  // Getters globales (Dashboard)
  const globalStats = computed(() => {
    let totalLimit = 0
    let totalDebt = 0
    let totalEsteMes = 0

    cards.value.forEach(card => {
      const cycles = calculateCardCycles(card)
      totalLimit += card.limit
      totalDebt += card.usedBalance
      totalEsteMes += cycles.A_Pagar_Este_Mes
    })

    return { totalLimit, totalDebt, totalEsteMes }
  })

  return {
    cards,
    loading,
    fetchCards,
    stopSync,
    addCard,
    updateCard,
    deleteCard,
    reorderCards,
    globalStats
  }
})
