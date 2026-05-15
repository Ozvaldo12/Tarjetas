<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCardsStore } from '@/stores/useCardsStore'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import CreditCard from '@/components/cards/CreditCard.vue'
import AddCardModal from '@/components/modals/AddCardModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const cardsStore = useCardsStore()

const showAddModal = ref(false)

onMounted(() => {
  cardsStore.fetchCards()
})

onUnmounted(() => {
  cardsStore.stopSync()
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleAddCard = async (cardData) => {
  try {
    await cardsStore.addCard(cardData)
    showAddModal.value = false
  } catch (error) {
    alert("Error al agregar la tarjeta. Revisa la consola.")
  }
}
</script>

<template>
  <div class="p-4 md:p-6 antialiased max-w-7xl mx-auto">
    
    <!-- HEADER -->
    <header class="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-200 pb-4">
      <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center">
        <span class="text-blue-600 mr-3 text-4xl">💳</span> Mis Tarjetas Pro
      </h1>
      <div class="flex items-center gap-4">
        <div class="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
          {{ authStore.user?.email }}
        </div>
        <button @click="handleLogout" class="px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors shadow-sm text-sm font-medium">
          Cerrar Sesión
        </button>
      </div>
    </header>

    <!-- DASHBOARD GLOBALES -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      <div class="lg:col-span-1">
        <DashboardStats />
      </div>
      <div class="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-center flex-col text-slate-400">
        <!-- Espacio para los gráficos que agregaremos luego -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>
        <p>Los gráficos se cargarán aquí...</p>
      </div>
    </section>

    <!-- ACCIONES Y LISTA DE TARJETAS -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-slate-800">Tus Tarjetas</h2>
      <button @click="showAddModal = true" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 text-sm transition-all shadow-md active:scale-95 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        Nueva Tarjeta
      </button>
    </div>

    <!-- LOADING STATE -->
    <div v-if="cardsStore.loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- TARJETAS GRID -->
    <div v-else-if="cardsStore.cards.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
      <CreditCard 
        v-for="card in cardsStore.cards" 
        :key="card.id" 
        :card="card" 
      />
    </div>

    <!-- EMPTY STATE -->
    <div v-else class="flex flex-col items-center justify-center py-16 text-slate-400 bg-white border border-slate-200 rounded-2xl border-dashed">
      <div class="text-6xl mb-4 opacity-50">🪪</div>
      <p class="text-lg font-medium">No has agregado ninguna tarjeta aún.</p>
    </div>

    <!-- MODAL -->
    <AddCardModal v-if="showAddModal" @close="showAddModal = false" @save="handleAddCard" />

  </div>
</template>
