<script setup>
import { computed } from 'vue'
import { useCardsStore } from '@/stores/useCardsStore'
import { useCalculations } from '@/composables/useCalculations'

const store = useCardsStore()
const { calculateGlobalProjections } = useCalculations()

const formatMoney = (amount) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
}

const projections = computed(() => calculateGlobalProjections(store.cards))
</script>

<template>
  <div class="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 overflow-hidden">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-bold text-slate-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        Proyección de Pagos (12 meses)
      </h3>
    </div>
    
    <div class="overflow-x-auto custom-scrollbar pb-2">
      <table class="w-full min-w-[800px] text-sm text-center">
        <thead>
          <tr>
            <th v-for="p in projections" :key="p.key" class="py-3 px-4 border-b-2 border-slate-100 font-bold text-slate-500 text-xs uppercase tracking-wider">
              {{ p.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="p in projections" :key="p.key" class="py-4 px-4 border-b border-slate-50">
              <span class="font-bold text-slate-800">{{ formatMoney(p.total) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
