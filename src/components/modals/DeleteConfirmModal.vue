<script setup>
const props = defineProps({
  purchase: { type: Object, required: true }
})
const emit = defineEmits(['close', 'confirm'])

const formatMoney = (a) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(a)
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-slate-800">Eliminar Compra</h3>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
        <p class="text-sm text-red-800 font-medium mb-2">¿Estás seguro de eliminar esta compra?</p>
        <div class="space-y-1">
          <p class="text-sm text-red-700"><strong>{{ purchase.description }}</strong></p>
          <p class="text-sm text-red-600">{{ formatMoney(purchase.amount) }}</p>
          <p class="text-xs text-red-400">Tarjeta: {{ purchase.cardName }}</p>
        </div>
        <p class="text-xs text-red-500 mt-3">Los balances se recalcularán automáticamente.</p>
      </div>

      <div class="flex justify-end gap-3">
        <button @click="$emit('close')" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">Cancelar</button>
        <button @click="$emit('confirm')" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">Eliminar</button>
      </div>
    </div>
  </div>
</template>
