<script setup>
import { ref, computed } from 'vue'
import { useCardsStore } from '@/stores/useCardsStore'
import { useToast } from '@/composables/useToast'
import EditPurchaseModal from '@/components/modals/EditPurchaseModal.vue'
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal.vue'

const store = useCardsStore()
const toast = useToast()

const selectedCardId = ref('')
const newPurchase = ref({
  description: '', amount: null, category: 'Otros',
  date: new Date().toISOString().split('T')[0],
  isMSI: false, months: 3, isRecurring: false
})
const categorias = ['Comida', 'Transporte', 'Suscripciones', 'Salud', 'Hogar', 'Entretenimiento', 'Otros']
const submitting = ref(false)

const handleAddPurchase = async () => {
  if (!selectedCardId.value) { toast.error('Selecciona una tarjeta'); return }
  if (!newPurchase.value.description || !newPurchase.value.amount) { toast.error('Completa los campos obligatorios'); return }
  submitting.value = true
  try {
    await store.addPurchaseToCard(selectedCardId.value, { ...newPurchase.value })
    toast.success('Compra registrada exitosamente')
    newPurchase.value = { description: '', amount: null, category: 'Otros', date: new Date().toISOString().split('T')[0], isMSI: false, months: 3, isRecurring: false }
  } catch (e) { toast.error('Error al registrar la compra') }
  finally { submitting.value = false }
}

const recentPurchases = computed(() => store.allPurchases.slice(0, 20))
const expandedCards = ref({})
const toggleCard = (id) => { expandedCards.value[id] = !expandedCards.value[id] }
const editingPurchase = ref(null)
const deletingPurchase = ref(null)
const openEdit = (p) => { editingPurchase.value = { ...p } }
const openDelete = (p) => { deletingPurchase.value = { ...p } }

const handleSaveEdit = async (data) => {
  try { await store.updatePurchase(editingPurchase.value.cardId, editingPurchase.value.id, data); toast.success('Compra actualizada'); editingPurchase.value = null }
  catch (e) { toast.error('Error al actualizar') }
}
const handleConfirmDelete = async () => {
  try { await store.deletePurchase(deletingPurchase.value.cardId, deletingPurchase.value.id); toast.success('Compra eliminada'); deletingPurchase.value = null }
  catch (e) { toast.error('Error al eliminar') }
}

const formatMoney = (a) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(a)
const searchQuery = ref('')
const filterCategory = ref('')
const filteredRecentPurchases = computed(() => {
  let r = recentPurchases.value
  if (searchQuery.value) { const q = searchQuery.value.toLowerCase(); r = r.filter(p => p.description.toLowerCase().includes(q) || p.cardName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) }
  if (filterCategory.value) r = r.filter(p => p.category === filterCategory.value)
  return r
})
const getTypeBadge = (p) => {
  if (p.isRecurring) return { label: 'Recurrente', cls: 'bg-purple-100 text-purple-700' }
  if (p.isMSI) return { label: `${p.months} MSI`, cls: 'bg-blue-100 text-blue-700' }
  return { label: 'Normal', cls: 'bg-slate-100 text-slate-600' }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
        <span class="text-2xl">🛒</span> Compras
      </h1>
      <p class="text-sm text-slate-500 mt-1">Registra, edita y gestiona todas tus compras.</p>
    </div>

    <!-- FORM -->
    <section class="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm mb-8">
      <div class="flex items-center gap-2 mb-5">
        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        </div>
        <h2 class="text-lg font-bold text-slate-800">Nueva Compra</h2>
      </div>
      <form @submit.prevent="handleAddPurchase" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1.5">Tarjeta *</label>
            <select v-model="selectedCardId" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
              <option value="" disabled>Selecciona una tarjeta...</option>
              <option v-for="card in store.cards" :key="card.id" :value="card.id">{{ card.name }} (Disp: {{ formatMoney(card.limit - card.usedBalance) }})</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1.5">Descripción *</label>
            <input v-model="newPurchase.description" type="text" placeholder="Ej: Supermercado, Netflix..." required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1.5">Monto *</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
              <input v-model.number="newPurchase.amount" type="number" step="0.01" min="0.01" placeholder="0.00" required class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1.5">Categoría</label>
            <select v-model="newPurchase.category" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500">
              <option v-for="c in categorias" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1.5">Fecha</label>
            <input v-model="newPurchase.date" type="date" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500">
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div class="flex items-center gap-5">
            <label class="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600"><input v-model="newPurchase.isMSI" type="checkbox" class="accent-blue-600 w-4 h-4"> MSI</label>
            <select v-if="newPurchase.isMSI" v-model.number="newPurchase.months" class="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none">
              <option value="3">3m</option><option value="6">6m</option><option value="9">9m</option><option value="12">12m</option><option value="18">18m</option><option value="24">24m</option>
            </select>
            <label class="flex items-center gap-2 cursor-pointer text-sm font-medium text-purple-600"><input v-model="newPurchase.isRecurring" type="checkbox" class="accent-purple-600 w-4 h-4"> Recurrente</label>
          </div>
          <button type="submit" :disabled="submitting" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-6 py-2.5 text-sm transition-all shadow-md active:scale-95 disabled:opacity-60 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            {{ submitting ? 'Guardando...' : 'Registrar Compra' }}
          </button>
        </div>
      </form>
    </section>

    <!-- SEARCH -->
    <div class="flex flex-col md:flex-row gap-3 mb-6">
      <div class="relative flex-1">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></span>
        <input v-model="searchQuery" type="text" placeholder="Buscar compras..." class="w-full bg-white border border-slate-200 rounded-xl text-sm pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500/30 outline-none shadow-sm">
      </div>
      <select v-model="filterCategory" class="bg-white border border-slate-200 rounded-xl text-sm px-4 py-2.5 outline-none shadow-sm min-w-[160px]">
        <option value="">Todas las categorías</option>
        <option v-for="c in categorias" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <!-- RECENT -->
    <section class="mb-8">
      <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Compras Recientes <span class="text-sm font-normal text-slate-400 ml-1">({{ filteredRecentPurchases.length }})</span>
      </h2>
      <div v-if="filteredRecentPurchases.length === 0" class="flex flex-col items-center py-10 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
        <span class="text-4xl mb-2 opacity-50">🛍️</span> No se encontraron compras.
      </div>
      <div v-else class="flex flex-col gap-2">
        <div v-for="p in filteredRecentPurchases" :key="p.id" class="bg-white border border-slate-200 rounded-xl p-3 md:p-4 flex items-center justify-between gap-3 hover:shadow-sm transition-all">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-slate-800 truncate">{{ p.description }}</p>
            <div class="flex items-center gap-2 mt-1 flex-wrap">
              <span class="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{{ p.cardName }}</span>
              <span class="text-[11px] text-slate-400">{{ p.date }}</span>
              <span :class="['text-[10px] font-bold px-1.5 py-0.5 rounded uppercase', getTypeBadge(p).cls]">{{ getTypeBadge(p).label }}</span>
              <span class="text-[11px] text-slate-400">{{ p.category }}</span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1 shrink-0">
            <p class="text-sm font-extrabold text-rose-600">{{ formatMoney(p.amount) }}</p>
            <div class="flex gap-1">
              <button @click="openEdit(p)" class="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Editar">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button @click="openDelete(p)" class="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PER CARD -->
    <section class="mb-8">
      <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
        Compras por Tarjeta
      </h2>
      <div v-if="store.cards.length === 0" class="flex flex-col items-center py-10 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
        <span class="text-4xl mb-2 opacity-50">💳</span> No hay tarjetas registradas.
      </div>
      <div v-else class="space-y-3">
        <div v-for="card in store.cards" :key="card.id" class="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <button @click="toggleCard(card.id)" class="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left">
            <div class="flex items-center gap-3">
              <span class="text-xl">💳</span>
              <div><p class="font-bold text-slate-800 text-sm">{{ card.name }}</p><p class="text-xs text-slate-400">{{ (card.purchases || []).length }} compras · {{ formatMoney(card.usedBalance) }}</p></div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" :class="['w-5 h-5 text-slate-400 transition-transform', expandedCards[card.id] ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div v-if="expandedCards[card.id]" class="px-4 pb-4 space-y-2">
            <p v-if="!card.purchases || card.purchases.length === 0" class="text-xs text-slate-400 italic text-center py-3">Sin compras.</p>
            <div v-for="p in (card.purchases || []).slice().reverse()" :key="p.id" class="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <div class="min-w-0 flex-1">
                <p class="text-xs font-bold text-slate-700 truncate">{{ p.description }}</p>
                <div class="flex items-center gap-2 mt-0.5"><span class="text-[10px] text-slate-400">{{ p.date }}</span><span :class="['text-[9px] font-bold px-1 py-0.5 rounded uppercase', getTypeBadge(p).cls]">{{ getTypeBadge(p).label }}</span></div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-xs font-bold text-rose-600">{{ formatMoney(p.amount) }}</span>
                <button @click="openEdit({ ...p, cardId: card.id, cardName: card.name })" class="p-1 text-slate-400 hover:text-blue-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                <button @click="openDelete({ ...p, cardId: card.id, cardName: card.name })" class="p-1 text-slate-400 hover:text-red-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MODALS -->
    <EditPurchaseModal v-if="editingPurchase" :purchase="editingPurchase" @close="editingPurchase = null" @save="handleSaveEdit" />
    <DeleteConfirmModal v-if="deletingPurchase" :purchase="deletingPurchase" @close="deletingPurchase = null" @confirm="handleConfirmDelete" />
  </div>
</template>
