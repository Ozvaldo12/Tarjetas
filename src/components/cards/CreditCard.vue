<script setup>
import { computed } from 'vue'
import { useCalculations } from '@/composables/useCalculations'
import { useCardsStore } from '@/stores/useCardsStore'

const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})

const store = useCardsStore()
const { calculateCardCycles } = useCalculations()

const cycles = computed(() => calculateCardCycles(props.card))

const formatMoney = (amount) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
}

const formatDateUI = (dateObj) => {
  const d = String(dateObj.getDate()).padStart(2, '0')
  const m = String(dateObj.getMonth() + 1).padStart(2, '0')
  const y = dateObj.getFullYear()
  return `${d}/${m}/${y}`
}

const availableCredit = computed(() => props.card.limit - props.card.usedBalance)
const usagePct = computed(() => Math.min((props.card.usedBalance / props.card.limit) * 100, 100))
const usageColor = computed(() => {
  if (usagePct.value < 30) return 'bg-emerald-500'
  if (usagePct.value <= 70) return 'bg-amber-400'
  return 'bg-red-500'
})

const diffDays = computed(() => {
  return Math.ceil((cycles.value.P_curr - new Date()) / (1000 * 60 * 60 * 24))
})

const handleDelete = async () => {
  if(confirm(`¿Estás seguro de eliminar la tarjeta ${props.card.name}?`)) {
    try {
      await store.deleteCard(props.card.id)
    } catch(error) {
      alert("Error al eliminar la tarjeta. Revisa la consola.")
    }
  }
}

// Nueva Compra
const newPurchase = ref({
  description: '',
  amount: null,
  category: 'Otros',
  date: new Date().toISOString().split('T')[0],
  isMSI: false,
  months: 3,
  isRecurring: false
})

const categorias = ["Comida", "Transporte", "Suscripciones", "Salud", "Hogar", "Entretenimiento", "Otros"]

const handleAddPurchase = async () => {
  const purchaseData = {
    ...newPurchase.value,
    id: crypto.randomUUID()
  }
  const updatedPurchases = [...props.card.purchases, purchaseData]
  
  try {
    await store.updateCard(props.card.id, { 
      purchases: updatedPurchases,
      usedBalance: props.card.usedBalance + (purchaseData.isRecurring ? 0 : purchaseData.amount)
    })
    
    // Reset
    newPurchase.value = {
      description: '', amount: null, category: 'Otros',
      date: new Date().toISOString().split('T')[0],
      isMSI: false, months: 3, isRecurring: false
    }
  } catch (error) {
    alert("Error al registrar la compra. Revisa la consola.")
  }
}
</script>

<template>
  <div class="bg-white border border-slate-200 shadow-sm hover:shadow-md rounded-2xl p-6 flex flex-col relative transition-all duration-300 group">
    
    <!-- Encabezado Tarjeta -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-xl font-extrabold text-slate-800 flex items-center">
          <span class="bg-slate-100 p-1.5 rounded-lg mr-2">💳</span> 
          {{ card.name }}
        </h3>
        <p class="text-xs font-medium text-slate-500 mt-2 flex flex-wrap items-center gap-y-1">
          <span>Corte: Día {{ card.cutoffDay }}</span>
          <span class="mx-1.5 text-slate-300">|</span>
          <span>Pago: +{{ card.paymentDays }} días</span> 
        </p>
      </div>
      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button @click="handleDelete" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>

    <!-- Barra de progreso -->
    <div class="w-full bg-slate-100 rounded-full h-2.5 mb-5 overflow-hidden border border-slate-200/50">
      <div :class="[usageColor, 'h-2.5 rounded-full transition-all duration-700 ease-out']" :style="{ width: `${usagePct}%` }"></div>
    </div>

    <!-- Detalles Financieros -->
    <div class="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-100 relative">
      <!-- Badge de Estado -->
      <div class="absolute right-4 top-4">
        <span v-if="cycles.A_Pagar_Este_Mes > 0 && diffDays < 0" class="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">VENCIDO</span>
        <span v-else-if="cycles.A_Pagar_Este_Mes > 0 && diffDays <= 5" class="bg-red-100 text-red-700 border border-red-200 font-bold text-[10px] px-2 py-0.5 rounded-full inline-flex items-center">
          <span class="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse"></span>En {{ diffDays }} días
        </span>
        <span v-else-if="card.usedBalance > 0" class="bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded-full">Cubierto</span>
      </div>

      <div class="flex justify-between text-sm mb-1.5 w-3/4"><span class="text-slate-500 font-medium">Límite:</span><span class="font-bold text-slate-700">{{ formatMoney(card.limit) }}</span></div>
      <div class="flex justify-between text-sm mb-3 w-3/4"><span class="text-slate-500 font-medium">Disponible:</span><span :class="['font-bold', availableCredit < 0 ? 'text-red-600' : 'text-emerald-600']">{{ formatMoney(availableCredit) }}</span></div>
      
      <div class="border-t border-slate-200/60 pt-3 grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
        <div>
          <span class="block text-slate-400 font-medium text-[10px] uppercase tracking-wider mb-0.5">Deuda Total</span>
          <span class="font-bold text-rose-600 text-sm">{{ formatMoney(card.usedBalance) }}</span>
        </div>
        <div>
          <span class="block text-slate-400 font-medium text-[10px] uppercase tracking-wider mb-0.5" :title="`Fecha límite: ${formatDateUI(cycles.P_curr)}`">A Pagar Este Mes</span>
          <span class="font-bold text-emerald-600 text-sm">{{ formatMoney(cycles.A_Pagar_Este_Mes) }}</span>
        </div>
        <div>
          <span class="block text-slate-400 font-medium text-[10px] uppercase tracking-wider mb-0.5">Siguiente Mes</span>
          <span class="font-bold text-slate-700 text-sm">{{ formatMoney(cycles.A_Pagar_Prox_Mes) }}</span>
        </div>
      </div>
    </div>

    <!-- Formulario de Compra -->
    <div class="flex-grow flex flex-col">
      <div class="flex items-center mb-3">
        <h4 class="text-sm font-bold text-slate-700">Registrar Compra</h4>
        <div class="flex-grow h-px bg-slate-200 ml-3"></div>
      </div>
      
      <form @submit.prevent="handleAddPurchase" class="mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div class="grid grid-cols-2 gap-2 mb-2">
          <input v-model="newPurchase.description" type="text" placeholder="Concepto" required class="bg-slate-50 border border-slate-200 rounded-md text-xs px-2.5 py-1.5 focus:border-blue-500 outline-none">
          <div class="relative">
            <span class="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs">$</span>
            <input v-model.number="newPurchase.amount" type="number" step="0.01" min="0.01" placeholder="Monto" required class="w-full bg-slate-50 border border-slate-200 rounded-md text-xs pl-6 pr-2.5 py-1.5 focus:border-blue-500 outline-none">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 mb-3">
          <select v-model="newPurchase.category" class="bg-slate-50 border border-slate-200 rounded-md text-xs px-2.5 py-1.5 focus:border-blue-500 outline-none">
            <option v-for="c in categorias" :key="c" :value="c">{{ c }}</option>
          </select>
          <input v-model="newPurchase.date" type="date" required class="bg-slate-50 border border-slate-200 rounded-md text-xs px-2.5 py-1.5 focus:border-blue-500 outline-none">
        </div>
        
        <div class="flex items-center justify-between border-t border-slate-100 pt-2.5">
          <div class="flex items-center gap-3 text-xs font-medium text-slate-600">
            <label class="flex items-center cursor-pointer hover:text-blue-600">
              <input v-model="newPurchase.isMSI" type="checkbox" class="mr-1.5 accent-blue-600"> MSI
            </label>
            <select v-if="newPurchase.isMSI" v-model.number="newPurchase.months" class="bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 outline-none">
              <option value="3">3m</option><option value="6">6m</option><option value="9">9m</option><option value="12">12m</option><option value="18">18m</option><option value="24">24m</option>
            </select>
            <label class="flex items-center text-purple-600 hover:text-purple-700">
              <input v-model="newPurchase.isRecurring" type="checkbox" class="mr-1.5 accent-purple-600"> Fijo
            </label>
          </div>
          <button type="submit" class="bg-blue-100 hover:bg-blue-600 text-blue-700 hover:text-white rounded-md p-1.5 px-3 text-xs transition-colors font-bold shadow-sm">
            +
          </button>
        </div>
      </form>
      
      <!-- Lista de Compras Recientes -->
      <div class="flex-grow overflow-y-auto max-h-48 pr-1 space-y-2.5 custom-scrollbar">
        <p v-if="card.purchases.length === 0" class="text-xs text-center italic text-slate-400 py-4">No hay movimientos.</p>
        <div v-for="p in card.purchases.slice().reverse()" :key="p.id" class="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div>
            <p class="text-xs font-bold text-slate-700">{{ p.description }}</p>
            <p class="text-[10px] text-slate-500">{{ p.date }} <span v-if="p.isMSI" class="ml-1 text-blue-600 font-semibold">{{ p.months }} MSI</span></p>
          </div>
          <div class="text-right">
            <p class="text-xs font-bold text-rose-600">{{ formatMoney(p.amount) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
