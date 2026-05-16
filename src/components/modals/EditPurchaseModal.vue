<script setup>
import { ref } from 'vue'

const props = defineProps({
  purchase: { type: Object, required: true }
})
const emit = defineEmits(['close', 'save'])

const categorias = ['Comida', 'Transporte', 'Suscripciones', 'Salud', 'Hogar', 'Entretenimiento', 'Otros']

const form = ref({
  description: props.purchase.description,
  amount: props.purchase.amount,
  category: props.purchase.category || 'Otros',
  date: props.purchase.date,
  isMSI: props.purchase.isMSI || false,
  months: props.purchase.months || 3,
  isRecurring: props.purchase.isRecurring || false
})

const saving = ref(false)

const handleSubmit = async () => {
  saving.value = true
  try {
    emit('save', { ...form.value })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
      <div class="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
        <h3 class="text-xl font-bold text-slate-800">Editar Compra</h3>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <p class="text-xs text-slate-400 mb-4">Tarjeta: <span class="font-semibold text-indigo-600">{{ purchase.cardName }}</span></p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
          <input v-model="form.description" type="text" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/50 outline-none">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Monto ($)</label>
          <input v-model.number="form.amount" type="number" step="0.01" min="0.01" required class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/50 outline-none">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
            <select v-model="form.category" class="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none">
              <option v-for="c in categorias" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
            <input v-model="form.date" type="date" required class="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none">
          </div>
        </div>
        <div class="flex items-center gap-5 pt-2">
          <label class="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer">
            <input v-model="form.isMSI" type="checkbox" class="accent-blue-600 w-4 h-4"> MSI
          </label>
          <select v-if="form.isMSI" v-model.number="form.months" class="border border-slate-300 rounded-lg px-2 py-1 text-sm outline-none">
            <option value="3">3m</option><option value="6">6m</option><option value="9">9m</option><option value="12">12m</option><option value="18">18m</option><option value="24">24m</option>
          </select>
          <label class="flex items-center gap-2 text-sm font-medium text-purple-600 cursor-pointer">
            <input v-model="form.isRecurring" type="checkbox" class="accent-purple-600 w-4 h-4"> Recurrente
          </label>
        </div>

        <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button type="button" @click="$emit('close')" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">Cancelar</button>
          <button type="submit" :disabled="saving" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-60">
            {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
