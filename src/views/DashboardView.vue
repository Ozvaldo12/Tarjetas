<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCardsStore } from '@/stores/useCardsStore'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import DashboardCharts from '@/components/dashboard/DashboardCharts.vue'
import DashboardFilters from '@/components/dashboard/DashboardFilters.vue'
import ProjectionTable from '@/components/dashboard/ProjectionTable.vue'
import CreditCard from '@/components/cards/CreditCard.vue'
import AddCardModal from '@/components/modals/AddCardModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const cardsStore = useCardsStore()

const showAddModal = ref(false)
const searchQuery = ref('')
const sortBy = ref('custom')

const filteredCards = computed(() => {
  let result = [...cardsStore.cards]
  
  // Filtrar
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(card => {
      if (card.name.toLowerCase().includes(q)) return true
      const purchases = card.purchases || []
      return purchases.some(p => 
        p.description.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      )
    })
  }
  
  // Ordenar
  if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'debt') {
    result.sort((a, b) => b.usedBalance - a.usedBalance)
  }
  // 'custom' order es el default
  
  console.log('[DashboardView] filteredCards calculado:', result.length, 'tarjetas encontradas.')
  return result
})

onMounted(() => {
  console.log('Dashboard mounted')
  console.log('[DashboardView] Estado de tarjetas:', cardsStore.cards)
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

console.log('[DashboardView] setup() finalizado correctamente, esperando render.')
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
      <div class="lg:col-span-2">
        <DashboardCharts />
      </div>
    </section>

    <!-- ACCIONES Y FILTROS -->
    <section class="mb-10 grid grid-cols-1 md:grid-cols-12 gap-6">
      <div class="md:col-span-8 bg-white border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Nueva Tarjeta
            </h2>
            <p class="text-sm text-slate-500 mt-1">Registra una nueva cuenta para empezar a organizar tus gastos.</p>
          </div>
          <button @click="showAddModal = true" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 whitespace-nowrap">
            Agregar Tarjeta
          </button>
        </div>
      </div>
      <div class="md:col-span-4">
        <DashboardFilters 
          v-model:searchQuery="searchQuery" 
          v-model:sortBy="sortBy" 
        />
      </div>
    </section>

    <!-- LOADING STATE -->
    <div v-if="cardsStore.loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- TARJETAS GRID -->
    <div v-else-if="filteredCards.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
      <CreditCard 
        v-for="card in filteredCards" 
        :key="card.id" 
        :card="card" 
      />
    </div>

    <!-- EMPTY STATE -->
    <div v-else class="flex flex-col items-center justify-center py-16 text-slate-400 bg-white border border-slate-200 rounded-2xl border-dashed mb-12">
      <div class="text-6xl mb-4 opacity-50">🪪</div>
      <p class="text-lg font-medium">No se encontraron tarjetas.</p>
    </div>

    <!-- PROYECCIONES -->
    <section class="mb-10">
      <ProjectionTable />
    </section>

    <!-- MODAL -->
    <AddCardModal v-if="showAddModal" @close="showAddModal = false" @save="handleAddCard" />

  </div>
</template>
