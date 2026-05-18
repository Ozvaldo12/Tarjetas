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
    borderColor: '#5c8b32',
    backgroundColor: 'rgba(92, 139, 50, 0.12)',
    borderWidth: 2,
    pointBackgroundColor: '#8fbf45',
    pointBorderColor: '#5c8b32',
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
    y: { beginAtZero: true, ticks: { callback: (v) => '$' + v.toLocaleString(), font: { size: 11 }, color: '#6b7c5e' }, grid: { color: 'rgba(212,224,200,0.5)' } },
    x: { ticks: { font: { size: 11 }, color: '#6b7c5e' }, grid: { color: 'rgba(212,224,200,0.3)' } }
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
      <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2" style="color: #0f0e0b;">
        <span class="text-2xl">📊</span> Proyecciones
      </h1>
      <p class="text-sm mt-1" style="color: #6b7c5e;">Visualiza la evolución de tu deuda en los próximos 12 meses.</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-white border rounded-2xl p-5 shadow-sm" style="border-color: #d4e0c8;">
        <p class="text-xs font-semibold uppercase tracking-wider mb-1" style="color: #6b7c5e;">Total Proyectado (12m)</p>
        <p class="text-2xl font-black" style="color: #0f0e0b;">{{ formatMoney(totalProjected) }}</p>
      </div>
      <div class="bg-white border rounded-2xl p-5 shadow-sm" style="border-color: #d4e0c8;">
        <p class="text-xs font-semibold uppercase tracking-wider mb-1" style="color: #6b7c5e;">Promedio Mensual</p>
        <p class="text-2xl font-black" style="color: #5c8b32;">{{ formatMoney(avgMonthly) }}</p>
      </div>
      <div class="bg-white border rounded-2xl p-5 shadow-sm" style="border-color: #d4e0c8;">
        <p class="text-xs font-semibold uppercase tracking-wider mb-1" style="color: #6b7c5e;">Mes Más Alto</p>
        <p class="text-2xl font-black" style="color: #c0392b;">{{ formatMoney(maxMonth.total) }}</p>
        <p class="text-xs mt-0.5" style="color: #8fa082;">{{ maxMonth.label }}</p>
      </div>
    </div>

    <!-- Chart -->
    <div class="bg-white border rounded-2xl p-6 shadow-sm mb-8" style="border-color: #d4e0c8;">
      <h3 class="text-sm font-bold uppercase tracking-wider mb-4" style="color: #6b7c5e;">Evolución de Deuda</h3>
      <div class="h-64 md:h-80">
        <Line v-if="store.cards.length > 0" :data="debtChartData" :options="debtChartOptions" />
        <div v-else class="flex h-full items-center justify-center text-sm" style="color: #8fa082;">Sin datos</div>
      </div>
    </div>

    <!-- Table -->
    <ProjectionTable />
  </div>
</template>
