<script setup>
import { computed, ref } from 'vue'
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
  if (usagePct.value < 30) return '#5c8b32'
  if (usagePct.value <= 70) return '#d4801a'
  return '#c0392b'
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
  const currentPurchases = props.card.purchases || []
  const updatedPurchases = [...currentPurchases, purchaseData]

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
  <div class="bg-white border shadow-sm hover:shadow-md rounded-2xl p-6 flex flex-col relative transition-all duration-300 group" style="border-color: #d4e0c8;">

    <!-- Encabezado Tarjeta -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-xl font-extrabold flex items-center" style="color: #0f0e0b;">
          <span class="p-1.5 rounded-lg mr-2" style="background: #eef3e8;">💳</span>
          {{ card.name }}
        </h3>
        <p class="text-xs font-medium mt-2 flex flex-wrap items-center gap-y-1" style="color: #6b7c5e;">
          <span>Corte: Día {{ card.cutoffDay }}</span>
          <span class="mx-1.5" style="color: #d4e0c8;">|</span>
          <span>Pago: +{{ card.paymentDays }} días</span>
        </p>
      </div>
      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button @click="handleDelete" class="p-1.5 rounded transition-colors" style="color: #8fa082;" @mouseenter="$event.target.style.color='#c0392b'" @mouseleave="$event.target.style.color='#8fa082'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>

    <!-- Barra de progreso -->
    <div class="w-full rounded-full h-2.5 mb-5 overflow-hidden" style="background: #eef3e8;">
      <div
        class="h-2.5 rounded-full transition-all duration-700 ease-out"
        :style="{ width: `${usagePct}%`, background: usageColor }"
      ></div>
    </div>

    <!-- Detalles Financieros -->
    <div class="rounded-xl p-4 mb-5 border relative" style="background: #f4f7f0; border-color: #e6eedf;">
      <!-- Badge de Estado -->
      <div class="absolute right-4 top-4">
        <span v-if="cycles.A_Pagar_Este_Mes > 0 && diffDays < 0" class="text-white font-bold text-[10px] px-2 py-0.5 rounded" style="background: #c0392b;">VENCIDO</span>
        <span v-else-if="cycles.A_Pagar_Este_Mes > 0 && diffDays <= 5" class="font-bold text-[10px] px-2 py-0.5 rounded-full inline-flex items-center" style="background: #fdecea; color: #c0392b; border: 1px solid #f5c6c6;">
          <span class="w-1.5 h-1.5 rounded-full mr-1 animate-pulse" style="background: #c0392b;"></span>En {{ diffDays }} días
        </span>
        <span v-else-if="card.usedBalance > 0" class="font-bold text-[10px] px-2 py-0.5 rounded-full" style="background: #eef3e8; color: #5c8b32; border: 1px solid #c8ddb2;">Cubierto</span>
      </div>

      <div class="flex justify-between text-sm mb-1.5 w-3/4">
        <span class="font-medium" style="color: #6b7c5e;">Límite:</span>
        <span class="font-bold" style="color: #0f0e0b;">{{ formatMoney(card.limit) }}</span>
      </div>
      <div class="flex justify-between text-sm mb-3 w-3/4">
        <span class="font-medium" style="color: #6b7c5e;">Disponible:</span>
        <span :style="{ fontWeight: 'bold', color: availableCredit < 0 ? '#c0392b' : '#5c8b32' }">{{ formatMoney(availableCredit) }}</span>
      </div>

      <div class="pt-3 grid grid-cols-2 gap-y-4 gap-x-2 text-xs" style="border-top: 1px solid #d4e0c8;">
        <div>
          <span class="block font-medium text-[10px] uppercase tracking-wider mb-0.5" style="color: #8fa082;">Deuda Total</span>
          <span class="font-bold text-sm" style="color: #c0392b;">{{ formatMoney(card.usedBalance) }}</span>
        </div>
        <div>
          <span class="block font-medium text-[10px] uppercase tracking-wider mb-0.5" style="color: #8fa082;" :title="`Fecha límite: ${formatDateUI(cycles.P_curr)}`">A Pagar Este Mes</span>
          <span class="font-bold text-sm" style="color: #5c8b32;">{{ formatMoney(cycles.A_Pagar_Este_Mes) }}</span>
        </div>
        <div>
          <span class="block font-medium text-[10px] uppercase tracking-wider mb-0.5" style="color: #8fa082;">Siguiente Mes</span>
          <span class="font-bold text-sm" style="color: #0f0e0b;">{{ formatMoney(cycles.A_Pagar_Prox_Mes) }}</span>
        </div>
      </div>
    </div>

    <!-- Formulario de Compra -->
    <div class="flex-grow flex flex-col">
      <div class="flex items-center mb-3">
        <h4 class="text-sm font-bold" style="color: #0f0e0b;">Registrar Compra</h4>
        <div class="flex-grow h-px ml-3" style="background: #d4e0c8;"></div>
      </div>

      <form @submit.prevent="handleAddPurchase" class="mb-4 bg-white p-3 rounded-xl border shadow-sm" style="border-color: #d4e0c8;">
        <div class="grid grid-cols-2 gap-2 mb-2">
          <input v-model="newPurchase.description" type="text" placeholder="Concepto" required
            class="rounded-md text-xs px-2.5 py-1.5 outline-none transition"
            style="background: #f4f7f0; border: 1px solid #d4e0c8; color: #0f0e0b;"
            @focus="$event.target.style.borderColor='#5c8b32'"
            @blur="$event.target.style.borderColor='#d4e0c8'"
          >
          <div class="relative">
            <span class="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-xs" style="color: #8fa082;">$</span>
            <input v-model.number="newPurchase.amount" type="number" step="0.01" min="0.01" placeholder="Monto" required
              class="w-full rounded-md text-xs pl-6 pr-2.5 py-1.5 outline-none transition"
              style="background: #f4f7f0; border: 1px solid #d4e0c8; color: #0f0e0b;"
              @focus="$event.target.style.borderColor='#5c8b32'"
              @blur="$event.target.style.borderColor='#d4e0c8'"
            >
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 mb-3">
          <select v-model="newPurchase.category"
            class="rounded-md text-xs px-2.5 py-1.5 outline-none"
            style="background: #f4f7f0; border: 1px solid #d4e0c8; color: #0f0e0b;"
          >
            <option v-for="c in categorias" :key="c" :value="c">{{ c }}</option>
          </select>
          <input v-model="newPurchase.date" type="date" required
            class="rounded-md text-xs px-2.5 py-1.5 outline-none"
            style="background: #f4f7f0; border: 1px solid #d4e0c8; color: #0f0e0b;"
          >
        </div>

        <div class="flex items-center justify-between pt-2.5" style="border-top: 1px solid #e6eedf;">
          <div class="flex items-center gap-3 text-xs font-medium" style="color: #6b7c5e;">
            <label class="flex items-center cursor-pointer">
              <input v-model="newPurchase.isMSI" type="checkbox" class="mr-1.5" style="accent-color: #5c8b32;"> MSI
            </label>
            <select v-if="newPurchase.isMSI" v-model.number="newPurchase.months"
              class="rounded-md px-1.5 py-0.5 outline-none"
              style="background: #f4f7f0; border: 1px solid #d4e0c8; color: #0f0e0b;"
            >
              <option value="3">3m</option><option value="6">6m</option><option value="9">9m</option><option value="12">12m</option><option value="18">18m</option><option value="24">24m</option>
            </select>
            <label class="flex items-center cursor-pointer" style="color: #5c8b32;">
              <input v-model="newPurchase.isRecurring" type="checkbox" class="mr-1.5" style="accent-color: #5c8b32;"> Fijo
            </label>
          </div>
          <button type="submit"
            class="rounded-md p-1.5 px-3 text-xs transition-all font-bold shadow-sm"
            style="background: #eef3e8; color: #5c8b32; border: 1px solid #c8ddb2;"
            @mouseenter="e => { e.target.style.background='#5c8b32'; e.target.style.color='white'; }"
            @mouseleave="e => { e.target.style.background='#eef3e8'; e.target.style.color='#5c8b32'; }"
          >
            +
          </button>
        </div>
      </form>

      <!-- Lista de Compras Recientes -->
      <div class="flex-grow overflow-y-auto max-h-48 pr-1 space-y-2.5 custom-scrollbar">
        <p v-if="!card.purchases || card.purchases.length === 0" class="text-xs text-center italic py-4" style="color: #8fa082;">No hay movimientos.</p>
        <div v-for="p in (card.purchases || []).slice().reverse()" :key="p.id"
          class="flex justify-between items-center p-2 rounded-lg border"
          style="background: #f4f7f0; border-color: #e6eedf;"
        >
          <div>
            <p class="text-xs font-bold" style="color: #0f0e0b;">{{ p.description }}</p>
            <p class="text-[10px]" style="color: #6b7c5e;">{{ p.date }}
              <span v-if="p.isMSI" class="ml-1 font-semibold" style="color: #5c8b32;">{{ p.months }} MSI</span>
            </p>
          </div>
          <div class="text-right">
            <p class="text-xs font-bold" style="color: #c0392b;">{{ formatMoney(p.amount) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
