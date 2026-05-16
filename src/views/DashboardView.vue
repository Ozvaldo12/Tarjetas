<script setup>
import { computed } from 'vue'
import { useCardsStore } from '@/stores/useCardsStore'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import DashboardCharts from '@/components/dashboard/DashboardCharts.vue'

const cardsStore = useCardsStore()

const recentPurchases = computed(() => cardsStore.allPurchases.slice(0, 5))

const formatMoney = (amount) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
}

console.log('[DashboardView] setup() finalizado correctamente, esperando render.')
</script>

<template>
  <div>
    <!-- PAGE HEADER -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
        <span class="text-2xl">📈</span> Dashboard
      </h1>
      <p class="text-sm text-slate-500 mt-1">Resumen general de tus finanzas.</p>
    </div>

    <!-- DASHBOARD GLOBALES -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      <div class="lg:col-span-1">
        <DashboardStats />
      </div>
      <div class="lg:col-span-2">
        <DashboardCharts />
      </div>
    </section>

    <!-- QUICK LINKS -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <router-link to="/compras" class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex items-center gap-4">
        <div class="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
        </div>
        <div>
          <p class="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Compras</p>
          <p class="text-xs text-slate-400">Registrar y gestionar</p>
        </div>
      </router-link>

      <router-link to="/tarjetas" class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex items-center gap-4">
        <div class="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
        </div>
        <div>
          <p class="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Tarjetas</p>
          <p class="text-xs text-slate-400">{{ cardsStore.cards.length }} registradas</p>
        </div>
      </router-link>

      <router-link to="/proyecciones" class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex items-center gap-4">
        <div class="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        </div>
        <div>
          <p class="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Proyecciones</p>
          <p class="text-xs text-slate-400">Deuda a 12 meses</p>
        </div>
      </router-link>
    </section>

    <!-- RECENT PURCHASES -->
    <section class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-bold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Últimas Compras
        </h2>
        <router-link to="/compras" class="text-xs font-semibold text-blue-600 hover:text-blue-700">Ver todas →</router-link>
      </div>

      <div v-if="recentPurchases.length === 0" class="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-sm">
        No hay compras registradas aún.
      </div>

      <div v-else class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div v-for="(p, i) in recentPurchases" :key="p.id" :class="['flex items-center justify-between px-4 py-3', i < recentPurchases.length - 1 ? 'border-b border-slate-100' : '']">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-slate-700 truncate">{{ p.description }}</p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{{ p.cardName }}</span>
              <span class="text-[11px] text-slate-400">{{ p.date }}</span>
            </div>
          </div>
          <p class="text-sm font-extrabold text-rose-600 shrink-0">{{ formatMoney(p.amount) }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
