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
    if (!authStore.user || !authStore.user.uid) {
      console.error('[fetchCards] Usuario no autenticado o UID faltante.')
      return
    }

    console.log(`[fetchCards] Iniciando sync para user: ${authStore.user.uid}`)
    // Detener listener anterior si existe
    if (unsubscribe) { unsubscribe(); unsubscribe = null }
    loading.value = true
    const q = query(collection(db, `users/${authStore.user.uid}/cards`))
    
    unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cardsData = []
      querySnapshot.forEach((doc) => {
        cardsData.push({ id: doc.id, ...doc.data() })
      })
      cards.value = cardsData.sort((a, b) => (a.order || 0) - (b.order || 0))
      console.log(`[fetchCards] ${cardsData.length} tarjetas cargadas exitosamente.`)
      loading.value = false
    }, (error) => {
      console.error('[fetchCards] Error en onSnapshot:', error)
      loading.value = false
    })
  }

  const stopSync = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
      console.log('[stopSync] Sincronización detenida.')
    }
  }

  // Operaciones de Firebase
  const addCard = async (cardData) => {
    if (!authStore.user || !authStore.user.uid) throw new Error('Usuario no autenticado')
    try {
      const id = crypto.randomUUID()
      const docRef = doc(db, `users/${authStore.user.uid}/cards`, id)
      const payload = { ...cardData, order: cards.value.length }
      console.log(`[addCard] Guardando tarjeta ${id}:`, payload)
      await setDoc(docRef, payload)
      console.log(`[addCard] Tarjeta agregada exitosamente.`)
    } catch (error) {
      console.error(`[addCard] Error al agregar tarjeta:`, error)
      throw error
    }
  }

  const updateCard = async (id, cardData) => {
    if (!authStore.user || !authStore.user.uid) throw new Error('Usuario no autenticado')
    try {
      const docRef = doc(db, `users/${authStore.user.uid}/cards`, id)
      console.log(`[updateCard] Actualizando tarjeta ${id}:`, cardData)
      await setDoc(docRef, cardData, { merge: true })
      console.log(`[updateCard] Tarjeta actualizada exitosamente.`)
    } catch (error) {
      console.error(`[updateCard] Error al actualizar tarjeta:`, error)
      throw error
    }
  }

  const deleteCard = async (id) => {
    if (!authStore.user || !authStore.user.uid) throw new Error('Usuario no autenticado')
    try {
      const docRef = doc(db, `users/${authStore.user.uid}/cards`, id)
      console.log(`[deleteCard] Eliminando tarjeta ${id}`)
      await deleteDoc(docRef)
      console.log(`[deleteCard] Tarjeta eliminada exitosamente.`)
    } catch (error) {
      console.error(`[deleteCard] Error al eliminar tarjeta:`, error)
      throw error
    }
  }

  const reorderCards = async (newOrderCards) => {
    if (!authStore.user || !authStore.user.uid) return
    try {
      console.log('[reorderCards] Reordenando tarjetas...')
      const batch = newOrderCards.map((c, i) => updateCard(c.id, { order: i }))
      await Promise.all(batch)
      console.log('[reorderCards] Reordenamiento exitoso.')
    } catch (error) {
      console.error('[reorderCards] Error al reordenar:', error)
      throw error
    }
  }

  // --- CRUD de Compras ---

  const addPurchaseToCard = async (cardId, purchaseData) => {
    const card = cards.value.find(c => c.id === cardId)
    if (!card) throw new Error('Tarjeta no encontrada')

    const purchase = {
      ...purchaseData,
      id: crypto.randomUUID()
    }
    const currentPurchases = card.purchases || []
    const updatedPurchases = [...currentPurchases, purchase]

    // Recalcular usedBalance: sumar montos de compras no recurrentes
    const newUsedBalance = updatedPurchases
      .filter(p => !p.isRecurring)
      .reduce((sum, p) => sum + p.amount, 0)

    await updateCard(cardId, {
      purchases: updatedPurchases,
      usedBalance: newUsedBalance
    })

    return purchase
  }

  const updatePurchase = async (cardId, purchaseId, updatedData) => {
    const card = cards.value.find(c => c.id === cardId)
    if (!card) throw new Error('Tarjeta no encontrada')

    const currentPurchases = card.purchases || []
    const updatedPurchases = currentPurchases.map(p => {
      if (p.id === purchaseId) {
        return { ...p, ...updatedData }
      }
      return p
    })

    // Recalcular usedBalance
    const newUsedBalance = updatedPurchases
      .filter(p => !p.isRecurring)
      .reduce((sum, p) => sum + p.amount, 0)

    await updateCard(cardId, {
      purchases: updatedPurchases,
      usedBalance: newUsedBalance
    })
  }

  const deletePurchase = async (cardId, purchaseId) => {
    const card = cards.value.find(c => c.id === cardId)
    if (!card) throw new Error('Tarjeta no encontrada')

    const currentPurchases = card.purchases || []
    const updatedPurchases = currentPurchases.filter(p => p.id !== purchaseId)

    // Recalcular usedBalance
    const newUsedBalance = updatedPurchases
      .filter(p => !p.isRecurring)
      .reduce((sum, p) => sum + p.amount, 0)

    await updateCard(cardId, {
      purchases: updatedPurchases,
      usedBalance: newUsedBalance
    })
  }

  // Getter: Todas las compras de todas las tarjetas, con info de tarjeta
  const allPurchases = computed(() => {
    const all = []
    cards.value.forEach(card => {
      const purchases = card.purchases || []
      purchases.forEach(p => {
        all.push({
          ...p,
          cardId: card.id,
          cardName: card.name
        })
      })
    })
    // Ordenar por fecha descendente
    all.sort((a, b) => new Date(b.date) - new Date(a.date))
    return all
  })

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
    addPurchaseToCard,
    updatePurchase,
    deletePurchase,
    allPurchases,
    globalStats
  }
})
