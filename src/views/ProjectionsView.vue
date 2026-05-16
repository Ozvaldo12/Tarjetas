<script setup>
import { computed } from 'vue'
import { useCardsStore } from '@/stores/useCardsStore'
import { useCalculations } from '@/composables/useCalculations'
import ProjectionTable from '@/components/dashboard/ProjectionTable.vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler)

const store = useCardsStore()
const { calculateGlobalProjections } = useCalculations()

const projections = computed(() => calculateGlobalProjections(store.cards))

const debtChartData = computed(() => ({
  labels: projections.value.map(p => p.label),
  datasets: [{
    label: 'Deuda Proyectada',
    data: projections.value.map(p => p.total),
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 2,
    pointBackgroundColor: '#3b82f6',
    pointRadius: 4,
    fill: true,
    tension: 0.3
  }]
}))

const debtChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, ticks: { callback: (v) => '$' + v.toLocaleString(), font: { size: 11 } } },
    x: { ticks: { font: { size: 11 } } }
  }
}

const formatMoney = (a) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(a)
const totalProjected = computed(() => projections.value.reduce((s, p) => s + p.total, 0))
const avgMonthly = computed(() => projections.value.length ? totalProjected.value / projections.value.length : 0)
const maxMonth = computed(() => {
  if (!projections.value.length) return { label: '-', total: 0 }
  return projections.value.reduce((max, p) => p.total > max.total ? p : max, projections.value[0])
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
        <span class="text-2xl">📊</span> Proyecciones
      </h1>
      <p class="text-sm text-slate-500 mt-1">Visualiza la evolución de tu deuda en los próximos 12 meses.</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Proyectado (12m)</p>
        <p class="text-2xl font-black text-slate-800">{{ formatMoney(totalProjected) }}</p>
      </div>
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Promedio Mensual</p>
        <p class="text-2xl font-black text-blue-600">{{ formatMoney(avgMonthly) }}</p>
      </div>
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Mes Más Alto</p>
        <p class="text-2xl font-black text-rose-600">{{ formatMoney(maxMonth.total) }}</p>
        <p class="text-xs text-slate-400 mt-0.5">{{ maxMonth.label }}</p>
      </div>
    </div>

    <!-- Chart -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
      <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Evolución de Deuda</h3>
      <div class="h-64 md:h-80">
        <Line v-if="store.cards.length > 0" :data="debtChartData" :options="debtChartOptions" />
        <div v-else class="flex h-full items-center justify-center text-sm text-slate-400">Sin datos</div>
      </div>
    </div>

    <!-- Table -->
    <ProjectionTable />
  </div>
</template>
