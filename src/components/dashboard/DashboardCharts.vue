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
  LineElement,
  Filler
} from 'chart.js'
import { useCardsStore } from '@/stores/useCardsStore'
import { useCalculations } from '@/composables/useCalculations'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Filler)

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
      backgroundColor: ['#c0392b', '#5c8b32'],
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
      borderColor: '#5c8b32',
      backgroundColor: 'rgba(92, 139, 50, 0.12)',
      borderWidth: 2,
      pointBackgroundColor: '#8fbf45',
      pointBorderColor: '#5c8b32',
      pointRadius: 3,
      fill: true,
      tension: 0.3
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
        font: { size: 10 },
        color: '#6b7c5e'
      },
      grid: {
        color: 'rgba(212, 224, 200, 0.5)'
      }
    },
    x: {
      ticks: { font: { size: 10 }, color: '#6b7c5e' },
      grid: {
        color: 'rgba(212, 224, 200, 0.3)'
      }
    }
  }
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">

    <div class="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative" style="border-color: #d4e0c8;">
      <h3 class="text-xs font-bold mb-4 uppercase tracking-wider text-center" style="color: #6b7c5e;">Uso de Crédito</h3>
      <div class="h-40 relative">
        <Doughnut v-if="store.cards.length > 0" :data="usageChartData" :options="usageChartOptions" />
        <div v-else class="flex h-full items-center justify-center text-sm" style="color: #8fa082;">Sin datos</div>

        <!-- Center Text -->
        <div v-if="store.cards.length > 0" class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span class="text-xl font-black" style="color: #0f0e0b;">{{ usagePct }}%</span>
        </div>
      </div>
      <!-- Legend -->
      <div v-if="store.cards.length > 0" class="flex justify-center gap-4 mt-3">
        <div class="flex items-center gap-1.5">
          <div class="w-2.5 h-2.5 rounded-full" style="background: #c0392b;"></div>
          <span class="text-[10px] font-medium" style="color: #6b7c5e;">Deuda</span>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="w-2.5 h-2.5 rounded-full" style="background: #5c8b32;"></div>
          <span class="text-[10px] font-medium" style="color: #6b7c5e;">Disponible</span>
        </div>
      </div>
    </div>

    <div class="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow" style="border-color: #d4e0c8;">
      <h3 class="text-xs font-bold mb-4 uppercase tracking-wider text-center" style="color: #6b7c5e;">Evolución de Deuda</h3>
      <div class="h-40">
        <Line v-if="store.cards.length > 0" :data="debtChartData" :options="debtChartOptions" />
        <div v-else class="flex h-full items-center justify-center text-sm" style="color: #8fa082;">Sin datos</div>
      </div>
    </div>

  </div>
</template>
