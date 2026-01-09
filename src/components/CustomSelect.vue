<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Определяем типы для опций
interface Option {
  value: string
  label: string
}

const props = defineProps<{
  options: Option[]
  placeholder?: string
  modelValue?: string // для v-model поддержки
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'select': [value: string]
}>()

const isOpen = ref(false)
const selectedOption = ref(props.modelValue || props.placeholder || "")
const selectRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  selectOption('acceptance')
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleSelect = (event: MouseEvent) => {
  isOpen.value = !isOpen.value
  event.stopPropagation()
}

const selectOption = (optionValue: string) => {
  selectedOption.value = optionValue
  isOpen.value = !isOpen.value
  // Эмитим событие выбора
  emit('select', optionValue)
  emit('update:modelValue', optionValue)
  
  console.log('Выбрано:', optionValue)
}

// Преобразуем опции если они приходят как массив строк
const normalizedOptions = ref<Option[]>([])

import { watch } from 'vue'
import type { PropType } from 'vue'

// Обрабатываем входные данные опций
watch(() => props.options, (newOptions) => {
  if (Array.isArray(newOptions)) {
    if (newOptions.length > 0 && typeof newOptions[0] === 'string') {
      // Если опции - массив строк
      normalizedOptions.value = (newOptions as string[]).map(option => ({
        value: option,
        label: option === 'acceptance' ? 'Приёмка' : 
               option === 'issue' ? 'Выдача' : option
      }))
    } else {
      // Если опции уже в правильном формате
      normalizedOptions.value = newOptions as Option[]
    }
  }
}, { immediate: true })

// Функция для форматирования отображаемого значения
const formatDisplayValue = (value: string): string => {
  if (value === 'acceptance') return 'Приёмка'
  if (value === 'issue') return 'Выдача'
  return value || props.placeholder || 'Выберите действие'
}
</script>

<template>
  <div class="custom-select" ref="selectRef">
    <div class="select-header" @click="toggleSelect">
      <span>{{ formatDisplayValue(selectedOption) }}</span>
      <svg 
        class="arrow"
        :class="{ 'arrow-up': isOpen }"
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <div v-if="isOpen" class="select-options">
      <div 
        v-for="option in normalizedOptions" 
        :key="option.value"
        class="option"
        @click="() => selectOption(option.value)"
        :class="{ 'selected': selectedOption === option.value }"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-select {
  background-color: #fff;
  border-radius: 8px;
  position: relative;
  width: 55%;
  min-width: 150px;
  cursor: pointer;
  font-size: 16px;
  color: #2d3748;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.select-header {
  height: 65px;
  border-radius: 20px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.arrow {
  transition: transform 0.2s ease;
  color: #727272;
}

.arrow-up {
  transform: rotate(180deg);
}

.select-options {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  padding: 12px 0;
  max-height: 300px;
  overflow-y: auto;
}

.option {
  padding: 12px 20px;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.option:hover {
  background-color: #f7fafc;
}

.option.selected {
  background-color: #edf2f7;
  color: #2b6cb0;
  font-weight: 500;
}

/* Стилизация скроллбара */
.select-options::-webkit-scrollbar {
  width: 4px;
}

.select-options::-webkit-scrollbar-track {
  background: transparent;
}

.select-options::-webkit-scrollbar-thumb {
  background: #0066FF;
  border-radius: 2px;
}
</style>