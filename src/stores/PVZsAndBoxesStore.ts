import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TaskType } from './selectedTaskStore'

export const usePVZStore = defineStore('pvz', {
    state: () => ({
        pvzList: [] as Array<{
            id: number,
            location: string,
            boxes: Array<{
                id: number,
                pvzId: number,
                taskType: TaskType
            }>
        }>
    }),
    actions: {
        addPVZ(id: number, location: string) {
            const newPVZ = {
                id: id,
                location: location,
                boxes: []
            }
            this.pvzList.push(newPVZ)
        },
        addBoxes(id: number, pvzId: number, taskType: TaskType) {
            const pvz = this.pvzList.find(p => p.id === pvzId)
            if (pvz) {
                pvz.boxes.push({
                    id: id,
                    pvzId: pvzId,
                    taskType: taskType
                })
            }
        }
    }
})
