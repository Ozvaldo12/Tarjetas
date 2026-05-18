<script setup>
import { useCardsStore } from '@/stores/useCardsStore'
import { computed } from 'vue'

const store = useCardsStore()

const stats = computed(() => store.globalStats)

const formatMoney = (amount) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
}
</script>

<template>
  <div class="grid gap-4">
    <!-- Límite Global -->
    <div class="bg-white border rounded-2xl p-5 flex items-center shadow-sm" style="border-color: #d4e0c8;">
      <div class="p-4 rounded-xl mr-4" style="background: #eef3e8;">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" style="color: #5c8b32;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
        </svg>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider mb-1" style="color: #6b7c5e;">Límite Global Total</p>
        <p class="text-2xl font-black" style="color: #0f0e0b;">{{ formatMoney(stats.totalLimit) }}</p>
      </div>
    </div>

    <!-- Deuda Global -->
    <div class="bg-white border rounded-2xl p-5 flex items-center shadow-sm" style="border-color: #d4e0c8;">
      <div class="p-4 rounded-xl mr-4" style="background: #fdecea;">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" style="color: #c0392b;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
        </svg>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider mb-1" style="color: #6b7c5e;">Deuda Global</p>
        <p class="text-2xl font-black" style="color: #c0392b;">{{ formatMoney(stats.totalDebt) }}</p>
      </div>
    </div>

    <!-- A Pagar Este Mes -->
    <div class="bg-white border rounded-2xl p-5 flex items-center shadow-sm" style="border-color: #d4e0c8;">
      <div class="p-4 rounded-xl mr-4" style="background: #eef3e8;">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" style="color: #5c8b32;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider mb-1" style="color: #6b7c5e;" title="Suma consolidada a pagar este mes">A Pagar Este Mes</p>
        <p class="text-2xl font-black" style="color: #5c8b32;">{{ formatMoney(stats.totalEsteMes) }}</p>
      </div>
    </div>
  </div>
</template>
