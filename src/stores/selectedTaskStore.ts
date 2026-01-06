import { ref } from 'vue'
import { defineStore } from 'pinia'

export type TaskType = "Приёмка" | "Выдача" | null

export const useChoosenTaskStore = defineStore('choosenTask', () => {
    

  const currentTask = ref<TaskType>(null)

  return { currentTask }
})
