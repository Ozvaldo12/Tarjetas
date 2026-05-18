<script setup>
import { ref, computed } from 'vue'
import { useCardsStore } from '@/stores/useCardsStore'
import CreditCard from '@/components/cards/CreditCard.vue'
import AddCardModal from '@/components/modals/AddCardModal.vue'
import DashboardFilters from '@/components/dashboard/DashboardFilters.vue'

const store = useCardsStore()
const showAddModal = ref(false)
const searchQuery = ref('')
const sortBy = ref('custom')

const filteredCards = computed(() => {
  let result = [...store.cards]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(card => {
      if (card.name.toLowerCase().includes(q)) return true
      const purchases = card.purchases || []
      return purchases.some(p => p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    })
  }
  if (sortBy.value === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
  else if (sortBy.value === 'debt') result.sort((a, b) => b.usedBalance - a.usedBalance)
  return result
})

const handleAddCard = async (cardData) => {
  try { await store.addCard(cardData); showAddModal.value = false }
  catch (e) { alert('Error al agregar la tarjeta.') }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2" style="color: #0f0e0b;">
        <span class="text-2xl">💳</span> Mis Tarjetas
      </h1>
      <p class="text-sm mt-1" style="color: #6b7c5e;">Gestiona todas tus tarjetas de crédito.</p>
    </div>

    <!-- Actions -->
    <section class="mb-8 grid grid-cols-1 md:grid-cols-12 gap-6">
      <div class="md:col-span-8 bg-white border shadow-sm rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4" style="border-color: #d4e0c8;">
        <div>
          <h2 class="text-xl font-bold flex items-center" style="color: #0f0e0b;">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" style="color: #5c8b32;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Nueva Tarjeta
          </h2>
          <p class="text-sm mt-1" style="color: #6b7c5e;">Registra una nueva cuenta para organizar tus gastos.</p>
        </div>
        <button @click="showAddModal = true" class="text-white font-semibold rounded-lg px-6 py-3 text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 whitespace-nowrap" style="background: #5c8b32;" @mouseenter="$event.target.style.background='#184000'" @mouseleave="$event.target.style.background='#5c8b32'">
          Agregar Tarjeta
        </button>
      </div>
      <div class="md:col-span-4">
        <DashboardFilters v-model:searchQuery="searchQuery" v-model:sortBy="sortBy" />
      </div>
    </section>

    <!-- Loading -->
    <div v-if="store.loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2" style="border-color: #5c8b32;"></div>
    </div>

    <!-- Cards Grid -->
    <div v-else-if="filteredCards.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
      <CreditCard v-for="card in filteredCards" :key="card.id" :card="card" />
    </div>

    <!-- Empty -->
    <div v-else class="flex flex-col items-center justify-center py-16 bg-white border border-dashed rounded-2xl" style="color: #8fa082; border-color: #d4e0c8;">
      <div class="text-6xl mb-4 opacity-50">🪪</div>
      <p class="text-lg font-medium">No se encontraron tarjetas.</p>
    </div>

    <AddCardModal v-if="showAddModal" @close="showAddModal = false" @save="handleAddCard" />
  </div>
</template>
