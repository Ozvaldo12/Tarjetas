<script setup>
import { useToast } from '@/composables/useToast'

const { toasts } = useToast()

const iconMap = {
  success: '✓',
  error: '✕',
  info: 'ℹ'
}

const colorMap = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-blue-500'
}

const bgMap = {
  success: 'bg-emerald-50 border-emerald-200',
  error: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200'
}

const textMap = {
  success: 'text-emerald-800',
  error: 'text-red-800',
  info: 'text-blue-800'
}
</script>

<template>
  <div class="fixed bottom-20 md:bottom-6 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm min-w-[280px] max-w-[380px] transition-all duration-300',
          bgMap[toast.type],
          toast.visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
        ]"
      >
        <span
          :class="[
            'w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0',
            colorMap[toast.type]
          ]"
        >
          {{ iconMap[toast.type] }}
        </span>
        <p :class="['text-sm font-medium flex-1', textMap[toast.type]]">{{ toast.message }}</p>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.3s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(60px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(60px);
}
</style>
