<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'save'])

const name = ref('')
const limit = ref(0)
const cutoffDay = ref(1)
const paymentDays = ref(20)

const handleSubmit = () => {
  emit('save', {
    name: name.value,
    limit: limit.value,
    cutoffDay: cutoffDay.value,
    paymentDays: paymentDays.value,
    usedBalance: 0,
    interestRate: 0,
    purchases: []
  })
}
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
      <div class="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
        <h3 class="text-xl font-bold text-slate-800">Nueva Tarjeta</h3>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
          <input v-model="name" type="text" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/50 outline-none">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Límite ($)</label>
          <input v-model.number="limit" type="number" step="0.01" min="1" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/50 outline-none">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Día Corte (1-31)</label>
            <input v-model.number="cutoffDay" type="number" min="1" max="31" required class="w-full border border-slate-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-500/50 outline-none">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Días para Pagar</label>
            <input v-model.number="paymentDays" type="number" min="1" max="30" required class="w-full border border-slate-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-500/50 outline-none">
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button type="button" @click="$emit('close')" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg">Cancelar</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Agregar</button>
        </div>
      </form>
    </div>
  </div>
</template>
