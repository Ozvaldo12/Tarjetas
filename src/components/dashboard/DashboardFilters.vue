<script setup>
const props = defineProps({
  searchQuery: String,
  sortBy: String
})

const emit = defineEmits(['update:searchQuery', 'update:sortBy'])
</script>

<template>
  <div class="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex flex-col h-full">
    <div class="flex items-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
      <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider">Vista y Filtros</h3>
    </div>
    
    <div class="space-y-3">
      <div>
        <select 
          :value="sortBy" 
          @input="$emit('update:sortBy', $event.target.value)"
          class="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-600"
        >
          <option value="custom">⇅ Orden Personalizado (Arrastrar)</option>
          <option value="name">A-Z Alfabeto</option>
          <option value="debt">Mayor Deuda</option>
          <option value="payment">Mayor a Pagar</option>
        </select>
      </div>
      <div class="relative">
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </span>
        <input 
          type="text" 
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          placeholder="Buscar compra o categoría..." 
          class="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none"
        >
      </div>
    </div>
  </div>
</template>
