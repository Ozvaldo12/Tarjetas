<script setup>
import { computed } from 'vue'
import { Doughnut, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js'
import { useCardsStore } from '@/stores/useCardsStore'
import { useCalculations } from '@/composables/useCalculations'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, PointElement, LineElement)

const store = useCardsStore()
const { calculateGlobalProjections } = useCalculations()

// Doughnut Chart Data
const usageChartData = computed(() => {
  const stats = store.globalStats
  const available = Math.max(0, stats.totalLimit - stats.totalDebt)
  return {
    labels: ['Deuda Utilizada', 'Crédito Disponible'],
    datasets: [{
      data: [stats.totalDebt, available],
      backgroundColor: ['#ef4444', '#10b981'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  }
})

const usageChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  plugins: {
    legend: { display: false }
  }
}

const usagePct = computed(() => {
  const stats = store.globalStats
  if (stats.totalLimit === 0) return 0
  return Math.min((stats.totalDebt / stats.totalLimit) * 100, 100).toFixed(1)
})

// Line Chart Data (Projections)
const projections = computed(() => calculateGlobalProjections(store.cards))

const debtChartData = computed(() => {
  return {
    labels: projections.value.map(p => p.label),
    datasets: [{
      label: 'Deuda Proyectada',
      data: projections.value.map(p => p.total),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: '#3b82f6',
      pointRadius: 3,
      fill: true,
      tension: 0.1
    }]
  }
})

const debtChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (val) => '$' + val,
        font: { size: 10 }
      }
    },
    x: {
      ticks: { font: { size: 10 } }
    }
  }
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
    
    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative">
      <h3 class="text-xs text-slate-500 font-bold mb-4 uppercase tracking-wider text-center">Uso de Crédito</h3>
      <div class="h-40 relative">
        <Doughnut v-if="store.cards.length > 0" :data="usageChartData" :options="usageChartOptions" />
        <div v-else class="flex h-full items-center justify-center text-sm text-slate-400">Sin datos</div>
        
        <!-- Center Text -->
        <div v-if="store.cards.length > 0" class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span class="text-xl font-black text-slate-800">{{ usagePct }}%</span>
        </div>
      </div>
    </div>

    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 class="text-xs text-slate-500 font-bold mb-4 uppercase tracking-wider text-center">Evolución de Deuda</h3>
      <div class="h-40">
        <Line v-if="store.cards.length > 0" :data="debtChartData" :options="debtChartOptions" />
        <div v-else class="flex h-full items-center justify-center text-sm text-slate-400">Sin datos</div>
      </div>
    </div>

  </div>
</template>
